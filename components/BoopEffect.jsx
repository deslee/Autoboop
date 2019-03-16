import React from 'react';

export default ({position}) => {
    return <div style={{
        top: position.y-10,
        left: position.x,
    }}>
    <style jsx>{`
        div {
            position: absolute;
            color: white;
            font-size: 2rem;
            text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
            animation-name: fade;
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
            50% {
                opacity: 1;
            }
        }
    `}</style>
    boop!
    </div>
}