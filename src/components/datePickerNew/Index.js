import React from 'react'
import './style.scss'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
// import { Text } from '../text/Text'

export const DatePickerNew = (props) => {
    return (
        <div>
            {props.message ? <p className="fs-13 mb-0">{props.message ?? ""}</p> : null}

            <ReactDatePicker
                selected={props.deafultValue ? Date.parse(props.deafultValue) : null}
                onChange={date => props.selected(date)}
                placeholderText={props.placeholder ? props.placeholder : "dd/mm/yyyy"}
                showDisabledMonthNavigation
                className={`form-control shadow-none ${props.className || ""}`}
                style={props.style}
            />
        </div>
    );
};
