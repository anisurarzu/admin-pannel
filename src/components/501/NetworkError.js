import React from 'react'
import { Images } from '../../utils/Images'

export const NetworkError = (props) => {
    return (
        <div className="text-center w-100 mt-3">
            <img
                src={Images.NetworkError}
                alt="Network error"
                width={300}
                height={230}
                className="rounded"
            />
            <h6 className="text-muted font-16 mt-3">{props.message}</h6>
        </div>
    );
};
