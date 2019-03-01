import React, { useState, useEffect, useRef, useReducer } from 'react';

const catSteps = {
    PromptUserToMovePointer: "Move your cursor around in this box",
    PromptUserToHoldStill: "Hold still!",
    DisplayingCat: "Here it comes...",
    CatDisplayed: "Boop!"
}

const actionTypes = {
    mouseMovedInBox: 1,
    mouseLeftBox: 2,
    mouseHeldStillOverThreshold: 3,
    receivedCatAndDisplaying: 4
}

const initialState = {
    step: catSteps.PromptUserToMovePointer,
    position: undefined,
    cat: undefined
}

function reducer(state, action) {
    switch (action.type) {
        case actionTypes.mouseMovedInBox:
            return {
                step: catSteps.PromptUserToHoldStill
            }
        case actionTypes.mouseLeftBox:
            return {
                step: catSteps.PromptUserToMovePointer
            }
        case actionTypes.mouseHeldStillOverThreshold:
            return {
                step: catSteps.DisplayingCat,
                position: action.position
            }
        case actionTypes.receivedCatAndDisplaying:
            // are we still expecting a cat?
            if (state.step === catSteps.DisplayingCat) {
                return {
                    step: catSteps.CatDisplayed,
                    position: state.position,
                    cat: action.cat
                }
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
        {state.step}
    </div>;

    return <div
        ref={rootEl}
        className="app"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
    >
        {state.step !== catSteps.CatDisplayed && box}
        {state.step === catSteps.CatDisplayed && <img src={`https://s3.amazonaws.com/9312d73d-977e-4e5f-952f-b92d4a26fe09-static/autoboop/${state.cat.Filepath}`} />}
    </div>;
}