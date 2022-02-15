import React from 'react'
import './style.scss'
import ReactDatePicker from 'react-datepicker'
import { useController } from 'react-hook-form'
import 'react-datepicker/dist/react-datepicker.css'

// Date input without hook form validation
export const DatePicker = React.forwardRef((props, ref) => {
    return (
        <div>
            <ReactDatePicker
                ref={ref}
                name={props.name}
                selected={props.deafultValue ? Date.parse(props.deafultValue) : null}
                onChange={date => props.selected(date)}
                showDisabledMonthNavigation
                className="form-control shadow-none"
                style={props.style}
            />
        </div>
    );
});

// Date input with hook form validation
export const DateInput = ({ control, name, defaultValue, requiredMessage, onChange, style }) => {
    const {
        field: { ref, ...inputProps }
    } = useController({
        name,
        control,
        rules: { required: requiredMessage },
        defaultValue: defaultValue ? Date.parse(defaultValue) : null,
    })

    return <ReactDatePicker
        {...inputProps}
        inputRef={ref}
        selected={defaultValue ? Date.parse(defaultValue) : null}
        onChange={date => onChange(date)}
        showDisabledMonthNavigation
        className="form-control shadow-none"
        style={style}
    />
}
