export const catSteps = {
    PromptUserToMovePointer: 1,
    PromptUserToHoldStill: 2,
    RetrievingImage: 3,
    ShowingImage: 4,
    ImageLoaded: 5,
}

export const actionTypes = {
    mouseMovedInBox: 1,
    mouseLeftBox: 2,
    mouseHeldStillOverThreshold: 3,
    receivedCatAndDisplaying: 4,
    catImageLoaded: 5,
}

export const initialState = {
    step: catSteps.PromptUserToMovePointer,
    position: undefined,
    cat: undefined,
    boops: 0
}

export function reducer(state, action) {
    console.log(action)
    switch (action.type) {
        case actionTypes.mouseMovedInBox:
            return {
                step: catSteps.PromptUserToHoldStill,
                boops: state.boops,
                position: action.position
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

export const isRetrievingPosition = state => !(state.step === catSteps.ShowingImage || state.step === catSteps.ImageLoaded)