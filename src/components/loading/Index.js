import React from 'react'
import './style.scss'

export const PreLoader = () => {
    return (
        <div className="data-loader-container">
            <div className="flex-center flex-column">
                <div className="loader"></div>
            </div>
        </div>
    );
};