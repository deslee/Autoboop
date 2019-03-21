import React, { Fragment, useState } from 'react';
import BoopEffect from './BoopEffect';

export default ({ width, height, mouthX, mouthY, mousePosX, mousePosY, src, onImageLoad }) => {
    const [loaded, setLoaded] = useState(false)
    return <Fragment>
        <style jsx>{`
        .catContainer {
            position: absolute;
            top: 0;
            left: 0;
            overflow: hidden;
            width: 100%;
            height: 100%;
        }
        .catContainer img {
            position: absolute;
        }
        `}</style>
        <div className="catContainer">
            <img
                src={src}
                width={width}
                height={height}
                style={{
                    top: mousePosY - mouthY,
                    left: mousePosX - mouthX
                }}
                onLoad={() => {
                    setLoaded(true)
                    onImageLoad()
                }}
            />
            {loaded && <BoopEffect x={mousePosX} y={mousePosY} />}
        </div>
    </Fragment>
}