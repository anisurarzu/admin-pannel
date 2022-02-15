import React from 'react';
import './style.scss';

export const FormGroup = (props) => {
    return (
        <div className={props.className ? `form-group ${props.className}` : "form-group mb-4"}>
            {props.children}
        </div>
    );
};