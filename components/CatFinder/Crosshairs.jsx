import React from 'react';

export default ({x, y}) => {
    return <div style={{top: `${y}px`, left: `${x}px`}}>
        <style jsx>{`
        div {
            position: absolute;
            border-radius: 50%;
            border: 2px solid red;
            width: 3rem;
            height: 3rem;
            transform: translate(-1.5rem, -1.5rem);
        }
        `}</style>
    </div>
}