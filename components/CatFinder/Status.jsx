import React from 'react';
import captureOutboundLink from '../../util/captureOutboundLink';

export default ({ times }) => {
    const message = times > 0 ? `You've booped ${times} times!` : 'Boop some cats!'
    return <div>
        <style jsx>{`
        div {
            position: absolute;
            top: 0;
            left: 0;
            color: black;
            background: white;
            padding: .5rem;
        }
        `}</style>
        Author: <a href="https://le3.io" onClick={e => captureOutboundLink(e.target.href)} target="_blank" rel="noopener">le3.io</a> | {message}
    </div>
}