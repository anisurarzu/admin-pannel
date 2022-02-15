import React from 'react';
import './style.scss';

export const Text = (props) => {
    return <p className={props.className}>{props.children}</p>
};
