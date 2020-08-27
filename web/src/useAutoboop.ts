import { useRef, useReducer, useEffect, useCallback } from "react";
import retrieveImage from "./retrieveImage";

export type Step = 'promptUserToMovePointer' |
    'promptUserToHoldStill' |
    'retrievingImage' |
    'showingImage' |
    'imageLoaded'

type Action =
    {
        type: 'mouseMovedInBox',
        position: Position
    } |
    {
        type: 'mouseLeftBox'
    } |
    {
        type: 'mouseHeldStillOverThreshold'
    } |
    {
        type: 'receivedCatAndDisplaying',
        cat: Cat
    } |
    {
        type: 'catImageLoaded'
    }

type Cat = {
    fileName: string,
    x: number,
    y: number,
    width: number,
    height: number
}

type Position = {
    x: number,
    y: number
}

type State = {
    step: Step,
    boops: number,
    cat?: Cat,
    position: Position,
}

const initialState: State = {
    step: 'promptUserToMovePointer',
    boops: Number(localStorage.getItem('boops')) || 0,
    position: {
        x: 0,
        y: 0
    }
}

function reducer(state: State, action: Action): State {
    if (action.type === 'mouseMovedInBox') {
        return {
            ...state,
            position: action.position,
            cat: undefined,
            step: 'promptUserToHoldStill'
        }
    }
    else if (action.type === 'mouseLeftBox') {
        return {
            ...state,
            cat: undefined,
            step: 'promptUserToMovePointer'
        }
    }
    else if (action.type === 'mouseHeldStillOverThreshold') {
        return {
            ...state,
            cat: undefined,
            step: 'retrievingImage'
        }
    }
    else if (action.type === 'receivedCatAndDisplaying') {
        return {
            ...state,
            step: 'showingImage',
            cat: action.cat
        }
    }
    else if (action.type === 'catImageLoaded') {
        return {
            ...state,
            step: 'imageLoaded',
            boops: state.boops + 1
        }
    }
    else {
        return state;
    }
}

const isMobile = (process as any).browser && 'ontouchstart' in document.documentElement

export default function useAutoboop<T extends HTMLElement>(requiredDelay: number = 800) {
    const containerRef = useRef<T>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [state, dispatch] = useReducer(reducer, initialState)

    const newActivity = useCallback((x: number, y: number) => {
        if (!containerRef.current) {
            return
        }

        const rect = containerRef.current.getBoundingClientRect();
        const xPos = x - rect.left; //x position within the element.
        const yPos = y - rect.top;  //y position within the element.
        const xPerc = Math.round(xPos / rect.width * 100);
        const yPerc = Math.round(yPos / rect.height * 100);

        dispatch({
            type: 'mouseMovedInBox',
            position: {
                x: xPerc,
                y: yPerc
            }
        })
    }, [dispatch])

    const mouseLeft = useCallback(() => {
        dispatch({
            type: 'mouseLeftBox'
        })
    }, [dispatch])

    const touchStart = useCallback((e: TouchEvent) => {
        newActivity(e.touches[0].clientX, e.touches[0].clientY)
    }, [newActivity])
    const mouseMoved = useCallback((e: MouseEvent) => {
        newActivity(e.clientX, e.clientY)
    }, [newActivity])

    useEffect(() => {
        if (containerRef.current) {
            const current = containerRef.current
            const onMouseLeave = mouseLeft
            const onMouseMove = mouseMoved
            const onTouchStart = touchStart
            console.debug('registering event listeners')

            if (!isMobile) {
                current.addEventListener('mouseleave', onMouseLeave)
                current.addEventListener('mousemove', onMouseMove)
            }
            if (isMobile) {
                current.addEventListener('touchstart', onTouchStart)
            }

            return () => {
                console.debug('cleanup event listeners')
                current.removeEventListener('mouseleave', onMouseLeave)
                current.removeEventListener('mousemove', onMouseMove)
                current.removeEventListener('touchstart', onTouchStart)
            }
        }
    }, [containerRef, newActivity, mouseLeft, mouseMoved, touchStart])

    useEffect(() => {
        if (state.step === 'promptUserToHoldStill') {
            const timeout = setTimeout(() => {
                dispatch({
                    type: 'mouseHeldStillOverThreshold'
                })
            }, requiredDelay)
            return () => {
                clearTimeout(timeout)
            }
        }
    }, [state.step, state.position, requiredDelay])

    useEffect(() => {
        if (state.step === 'retrievingImage') {
            retrieveImage(state.position.x, state.position.y).then((image) => {
                if (!image) {
                    console.error(`Failed to retrieve image for position ${JSON.stringify(state.position)}`);
                }
                dispatch({
                    type: 'receivedCatAndDisplaying',
                    cat: {
                        fileName: image.fileName,
                        x: image.x,
                        y: image.y,
                        width: image.width,
                        height: image.height
                    }
                })
            })
        }
    }, [state.step, state.position])

    useEffect(() => {
        if (!imageRef.current) {
            return;
        }
        if (state.step === 'showingImage') {
            const current = imageRef.current
            const load = (e: Event) => {
                dispatch({
                    type: 'catImageLoaded'
                })
                localStorage.setItem('boops', String(state.boops + 1))
            }
            if (state.cat) {
                current.src = `https://storage.googleapis.com/autoboop-cats/${state.cat.fileName}`
                current.addEventListener('load', load)
            }
            else {
                console.error("Unexpected state - no cat")
            }
            return () => {
                current.removeEventListener('load', load)
            }
        }
    }, [imageRef, state.step, state.cat, state.boops])

    useEffect(() => {
        if (state.step !== 'showingImage' && state.step !== 'imageLoaded' && imageRef.current) {
            imageRef.current.src = undefined as any
        }
    }, [state.step, imageRef])

    return [containerRef, imageRef, state] as const
}