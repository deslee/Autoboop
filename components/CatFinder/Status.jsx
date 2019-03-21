import React, { Fragment, useState, useRef, useReducer } from 'react';

export default ({ times }) => {
    const message = times > 0 ? `You've booped ${times} times!` : 'Boop some cats!'
    return <div>
        <style jsx>{`
        div {
            position: fixed;
            top: 0;
            left: 0;
            color: black;
            background: white;
        }
        `}</style>
        Author: <a href="https://le3.io" target="_blank" rel="noopener">le3.io</a> | {message}
    </div>
}