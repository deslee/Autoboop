import React, { Fragment, useState, useRef, useReducer } from 'react';
import { reducer, catSteps, actionTypes, initialState, isRetrievingPosition } from './State';
import classNames from 'classnames';
import Cat from './Cat';
import Status from './Status';

export default ({ requiredDelay, isMobile }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [nudge, setNudge] = useState(false)
    const [timeoutHandles, setTimeoutHandles] = useState({})
    const rootEl = useRef()

    const catStepsMessage = {
        [catSteps.PromptUserToMovePointer]: !isMobile ? "Move your cursor around" : "Tap anywhere",
        [catSteps.PromptUserToHoldStill]: !isMobile ? "Detecting pointer... Hold still!" : "Hold still!",
        [catSteps.RetrievingImage]: "Here it comes...",
        [catSteps.ShowingImage]: "Here it comes...",
        [catSteps.ImageLoaded]: "",
    }

    const nudgeMessage = !isMobile ? 'Keep it up! Move your cursor around' : 'Keep it up! Tap anywhere!'

    const setNudgeTimeout = () => {
        setTimeoutHandles({
            ...timeoutHandles,
            nudgeTimeout: setTimeout(() => {
                setNudge(true)
            }, 3000)
        })
    }

    const clearNudgeTimeout = () => {
        clearTimeout(timeoutHandles.nudgeTimeout)
        setTimeoutHandles({
            ...timeoutHandles,
            nudgeTimeout: undefined
        })
    }

    const setWaitOnMouseTimeout = (position) => {
        setTimeoutHandles({
            ...timeoutHandles,
            waitOnMouseTimeout: setTimeout(() => {
                dispatch({ type: actionTypes.mouseHeldStillOverThreshold })
                getCatForPosition(position.xPerc, position.yPerc)
            }, requiredDelay)
        })
    }

    const clearWaitOnMouseTimeout = () => {
        clearTimeout(timeoutHandles.waitOnMouseTimeout)
        setTimeoutHandles({
            ...timeoutHandles,
            waitOnMouseTimeout: undefined
        })
    }

    const getCatForPosition = async (x, y) => {
        const response = await fetch(`/FindCatByPosition?x=${x}&y=${y}`)
        if (response.status === 200 && response.json) {
            const cat = await response.json()
            dispatch({ type: actionTypes.receivedCatAndDisplaying, cat })
        }
    }

    const onMouseMove = (e) => {
        dispatchActivity(e.clientX, e.clientY)
    }

    const onTouchStart = (e) => {
        dispatchActivity(e.touches[0].clientX, e.touches[0].clientY)
    }

    const dispatchActivity = (x, y) => {
        clearWaitOnMouseTimeout();
        clearNudgeTimeout();
        setNudge(false)
        const rect = rootEl.current.getBoundingClientRect();
        const xPos = x - rect.left; //x position within the element.
        const yPos = y - rect.top;  //y position within the element.
        const xPerc = Math.round(xPos / rect.width * 100);
        const yPerc = Math.round(yPos / rect.height * 100);
        const position = { xPerc, yPerc, xPos, yPos };
        dispatch({ type: actionTypes.mouseMovedInBox, position })
        setWaitOnMouseTimeout(position)
    }

    const onMouseLeave = () => {
        clearWaitOnMouseTimeout();
        clearNudgeTimeout();
        setNudge(false)
        dispatch({ type: actionTypes.mouseLeftBox })
    }

    const onImageLoad = () => {
        clearNudgeTimeout();
        setNudgeTimeout();
        dispatch({ type: actionTypes.catImageLoaded })
    }

    const calculateImageDimensions = () => {
        const { cat: { Width: oldWidth, Height: oldHeight, MouthX: oldMouthX, MouthY: oldMouthY }, position } = state;
        let width, height, mouthX, mouthY
        const { width: containerWidth, height: containerHeight } = rootEl.current.getBoundingClientRect();
        if (containerWidth > containerHeight) {
            // landscape
            width = containerWidth
            height = oldHeight / oldWidth * containerWidth
        } else {
            // vertical
            height = containerHeight
            width = oldWidth / oldHeight * containerHeight
        }

        mouthX = width / oldWidth * oldMouthX
        mouthY = height / oldHeight * oldMouthY

        return {
            width, height, mouthX, mouthY, mousePosX: position.xPos, mousePosY: position.yPos
        }
    }

    return <Fragment>
        <style jsx>{`
            .catFinder {
                width: 100%;
                height: 100%;
                padding: 2rem;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
            }
            .nudge {
                position: absolute;
                bottom: 0;
                font-size: 2rem;
                right: 0;
                padding: .5rem;
                background: white;
                animation-name: slideUp;
                animation-duration: .5s;
            }
            @keyframes slideUp {
                0% {
                    transform: translateY(2rem)
                }
                100% {
                    transform: translateY(0rem)
                }
            }
        `}</style>
        <div
            className={classNames({
                catFinder: true
            })}
            ref={rootEl}
            onMouseLeave={onMouseLeave}
            onMouseMove={!isMobile ? onMouseMove : undefined}
            onTouchStart={isMobile ? onTouchStart : undefined}
        >
            {isRetrievingPosition(state) && catStepsMessage[state.step]}
            {!isRetrievingPosition(state) && <Cat
                src={`https://s3.amazonaws.com/9312d73d-977e-4e5f-952f-b92d4a26fe09-static/autoboop/${state.cat.Filepath}`}
                onImageLoad={onImageLoad}
                {...calculateImageDimensions()}
            />}
        </div>
        <Status times={state.boops} />
        {nudge && <span className="nudge">
            {nudgeMessage}
        </span>}
    </Fragment>;
}