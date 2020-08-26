import React, { FC, useRef, useEffect, useState } from 'react'
import { Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    root: {
        position: 'absolute',
        animationName: '$fade',
        animationDuration: '2s',
        opacity: 0,
        zIndex: 10
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black',
        userSelect: 'none'
    },
    '@keyframes fade': {
        '0%': {
            opacity: 0,
            transform: 'translateY(0px)'
        },
        '100%': {
            opacity: 0,
            transform: 'translateY(-20px)'
        },
        '20%': {
            opacity: .65,
        }
    }
}))

const BoopEffect: FC<{ x: number, y: number }> = (props) => {
    const classes = useStyles(props);
    const textRef = useRef<HTMLElement>(null);
    const [textWidth, setTextWidth] = useState(0);
    useEffect(() => {
        if (textRef.current) {
            setTextWidth(textRef.current.offsetWidth)
        }
    }, [textRef])
    const { x, y } = props;
    return <div style={{top: `${y}%`, left: x > 50 ? `calc(${x}% - ${textWidth}px)`: `${x}%`}} className={classes.root}>
        <Typography ref={textRef} className={classes.text}>boop!</Typography>
    </div>
}

export default BoopEffect