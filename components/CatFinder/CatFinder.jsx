import React, { Fragment, useState, useRef, useReducer } from 'react';
import { reducer, catSteps, actionTypes, initialState, isRetrievingPosition } from './State';
import classNames from 'classnames';
import BoopEffect from './BoopEffect';
import Cat from './Cat';
import Status from './Status';

export default ({ requiredDelay, isMobile }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [timeoutHandles, setTimeoutHandles] = useState({})
    const rootEl = useRef()

    const catStepsMessage = {
        [catSteps.PromptUserToMovePointer]: !isMobile ? "Move your cursor around in this box" : "Tap inside this box",
        [catSteps.PromptUserToHoldStill]: "Hold still!",
        [catSteps.RetrievingImage]: "Here it comes...",
        [catSteps.ShowingImage]: "Here it comes...",
        [catSteps.ImageLoaded]: "",
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
        clearWaitOnMouseTimeout();
        const rect = rootEl.current.getBoundingClientRect();
        const xPos = e.clientX - rect.left; //x position within the element.
        const yPos = e.clientY - rect.top;  //y position within the element.
        const xPerc = Math.round(xPos / rect.width * 100);
        const yPerc = Math.round(yPos / rect.height * 100);
        const position = { xPerc, yPerc, xPos, yPos };
        dispatch({ type: actionTypes.mouseMovedInBox, position })
        setWaitOnMouseTimeout(position)
    }

    const onTouchStart = (e) => {
        clearWaitOnMouseTimeout();
        const rect = rootEl.current.getBoundingClientRect();
        const xPos = e.touches[0].clientX - rect.left; //x position within the element.
        const yPos = e.touches[0].clientY - rect.top;  //y position within the element.
        const xPerc = Math.round(xPos / rect.width * 100);
        const yPerc = Math.round(yPos / rect.height * 100);
        const position = { xPerc, yPerc, xPos, yPos };
        dispatch({ type: actionTypes.mouseMovedInBox, position })
        setWaitOnMouseTimeout(position)
    }

    const onMouseLeave = () => {
        clearWaitOnMouseTimeout();
        dispatch({ type: actionTypes.mouseLeftBox })
    }

    const onImageLoad = () => {
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
                width: 100vw;
                height: 100vh;
                padding: 2rem;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
            }
            .isRetrievingPosition .activeArea {
                background: lightgrey;
            }
        `}</style>
        <div
            className={classNames({
                catFinder: true,
                isRetrievingPosition: isRetrievingPosition(state)
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
                {...calculateImageDimensions()
            } />}
        </div>
        <Status times={state.boops} />
    </Fragment>;
}