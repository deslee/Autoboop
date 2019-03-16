import React, { useState, useRef, useReducer } from 'react';
import BoopEffect from './BoopEffect';

const catSteps = {
    PromptUserToMovePointer: 1,
    PromptUserToHoldStill: 2,
    RetrievingImage: 3,
    ShowingImage: 4,
    ImageLoaded: 5,
}

const catStepsMessage = {
    [catSteps.PromptUserToMovePointer]: "Move your cursor around in this box",
    [catSteps.PromptUserToHoldStill]: "Hold still!",
    [catSteps.RetrievingImage]: "Here it comes...",
    [catSteps.ShowingImage]: "Here it comes...",
    [catSteps.ImageLoaded]: "Boop!",
}

const actionTypes = {
    mouseMovedInBox: 1,
    mouseLeftBox: 2,
    mouseHeldStillOverThreshold: 3,
    receivedCatAndDisplaying: 4,
    catImageLoaded: 5,
}

const initialState = {
    step: catSteps.PromptUserToMovePointer,
    position: undefined,
    cat: undefined,
    boops: 0
}

function reducer(state, action) {
    switch (action.type) {
        case actionTypes.mouseMovedInBox:
            return {
                step: catSteps.PromptUserToHoldStill,
                boops: state.boops
            }
        case actionTypes.mouseLeftBox:
            return {
                step: catSteps.PromptUserToMovePointer,
                boops: state.boops
            }
        case actionTypes.mouseHeldStillOverThreshold:
            return {
                step: catSteps.RetrievingImage,
                position: action.position,
                boops: state.boops
            }
        case actionTypes.receivedCatAndDisplaying:
            // are we still expecting a cat?
            if (state.step === catSteps.RetrievingImage) {
                return {
                    step: catSteps.ShowingImage,
                    position: state.position,
                    cat: action.cat,
                    boops: state.boops + 1
                }
            } else {
                return state;
            }
        case actionTypes.catImageLoaded:
            return {
                ...state,
                step: catSteps.ImageLoaded
            }
        default:
            return state
    }
}

export default ({ margin, width, height, requiredDelay }) => {
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
        var rect = rootEl.current.getBoundingClientRect();
        var x = e.clientX - rect.left; //x position within the element.
        var y = e.clientY - rect.top;  //y position within the element.
        if (x - margin > 0 && y - margin > 0 && x - margin < width && y - margin < height) {
            dispatch({ type: actionTypes.mouseMovedInBox })
            // update timeouts
            setTimeoutHandles({
                ...timeoutHandles,
                waitOnMouseTimeout: setTimeout(() => {
                    dispatch({ type: actionTypes.mouseHeldStillOverThreshold, position: { x, y } })
                    getCatForPosition(x, y)
                }, requiredDelay)
            })
        } else {
            dispatch({ type: actionTypes.mouseLeftBox })
        }
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

    const box = <div
        style={{
            margin,
            padding: '1rem',
            boxSizing: 'border-box',
            width,
            height,
            color: 'black',
            border: '1px dashed grey',
            background: 'white'
        }}
    >
        {catStepsMessage[state.step]}
    </div>;

    const isRetrievingPosition = !(state.step === catSteps.ShowingImage || state.step === catSteps.ImageLoaded)

    const score = state.boops ? <React.Fragment>You've booped {state.boops} times!</React.Fragment> : <React.Fragment>Boop some cats!</React.Fragment>

    return <div>
        <style jsx>{`
            .app {
                overflow: hidden;
            }
        `}</style>
        <div>Author: <a href="https://le3.io" target="_blank" rel="noopener">le3.io</a> | {score}</div>
        <div
            ref={rootEl}
            className="app"
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
        >
            {state.step !== catSteps.ImageLoaded && box}
            {!isRetrievingPosition && <React.Fragment>
                <img
                    src={`https://s3.amazonaws.com/9312d73d-977e-4e5f-952f-b92d4a26fe09-static/autoboop/${state.cat.Filepath}`}
                    onLoad={onImageLoad}
                    style={state.step === catSteps.ImageLoaded ? {

                    } : {
                        visibility: 'hidden',
                        position: 'absolute',
                        top: '0'
                    }}
                />
                {state.step === catSteps.ImageLoaded && <BoopEffect
                    position={state.position}
                />}
            </React.Fragment>}
        </div>
    </div>;
}