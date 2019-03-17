import React, { Fragment, useState, useRef, useReducer } from 'react';
import { reducer, catSteps, actionTypes, initialState, isRetrievingPosition } from './State';
import classNames from 'classnames';
import BoopEffect from './BoopEffect';

const catStepsMessage = {
    [catSteps.PromptUserToMovePointer]: "Move your cursor around in this box",
    [catSteps.PromptUserToHoldStill]: "Hold still!",
    [catSteps.RetrievingImage]: "Here it comes...",
    [catSteps.ShowingImage]: "Here it comes...",
    [catSteps.ImageLoaded]: "",
}

export default ({ requiredDelay }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [timeoutHandles, setTimeoutHandles] = useState({})
    const rootEl = useRef()

    const getCatForPosition = async (x, y) => {
        const response = await fetch(`/FindCatByPosition?x=${x}&y=${y}`)
        if (response.status === 200 && response.json) {
            const cat = await response.json()
            dispatch({ type: actionTypes.receivedCatAndDisplaying, cat })
        }
    }

    const onMouseMove = (e) => {
        // clear timeouts
        clearTimeout(timeoutHandles.waitOnMouseTimeout)
        setTimeoutHandles({
            ...timeoutHandles,
            waitOnMouseTimeout: undefined
        })
        const rect = rootEl.current.getBoundingClientRect();
        console.log(rect)
        const xPos = e.clientX - rect.left; //x position within the element.
        const yPos = e.clientY - rect.top;  //y position within the element.
        const xPerc = Math.round(xPos / rect.width * 100);
        const yPerc = Math.round(yPos / rect.height * 100);
        dispatch({ type: actionTypes.mouseMovedInBox, position: { x: xPerc, y: yPerc } })
        // update timeouts
        setTimeoutHandles({
            ...timeoutHandles,
            waitOnMouseTimeout: setTimeout(() => {
                dispatch({ type: actionTypes.mouseHeldStillOverThreshold, position: { x: xPerc, y: yPerc } })
                getCatForPosition(xPerc, yPerc)
            }, requiredDelay)
        })
    }

    const onMouseLeave = () => {
        // clear timeouts
        clearTimeout(timeoutHandles.waitOnMouseTimeout)
        setTimeoutHandles({
            ...timeoutHandles,
            waitOnMouseTimeout: undefined
        })
        dispatch({ type: actionTypes.mouseLeftBox })
    }

    const onImageLoad = () => {
        dispatch({ type: actionTypes.catImageLoaded })
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
            .catContainer {
                position: absolute;
                top: 0;
                left: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                width: 100%;
                height: 100%;
            }
            .catContainer img {
                flex-shrink: 0;
                min-width: 100%;
                min-height: 100%;
            }
        `}</style>
        <div
            className={classNames({
                catFinder: true,
                isRetrievingPosition: isRetrievingPosition(state)
            })}
            ref={rootEl}
            onMouseLeave={onMouseLeave}
            onMouseMove={onMouseMove}
        >
            {catStepsMessage[state.step]}
            {!isRetrievingPosition(state) && <div className="catContainer">
                <img
                    src={`https://s3.amazonaws.com/9312d73d-977e-4e5f-952f-b92d4a26fe09-static/autoboop/${state.cat.Filepath}`}
                    onLoad={onImageLoad}
                    style={{
                    }}
                />
                {state.step === catSteps.ImageLoaded && <BoopEffect
                    position={state.position}
                />}
            </div>}
        </div>
    </Fragment>;
}