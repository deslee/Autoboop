import React from 'react';

export default ({ x, y }) => {
    return <div style={{
        top: y,
        left: x,
    }}>
    <style jsx>{`
        div {
            position: absolute;
            color: white;
            font-size: 2rem;
            text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
            animation-name: fade;
            cursor: pointer;
            font-family: sans-serif;
            animation-duration: 2s;
            opacity: 0;
        }

        @keyframes fade {
            0% {
                opacity: 0;
                transform: translateY(0px)
            }
            100% {
                opacity: 0;
                transform: translateY(-20px)
            }
            20% {
                opacity: .65;
            }
        }
    `}</style>
        boop!
    </div>
}