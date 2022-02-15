
import TimePickerComp from 'react-time-picker'
import { useController } from 'react-hook-form'
import './style.scss'

export const TimePicker = (props) => {
    const {
        field: { ref, ...inputProps }
    } = useController({
        name: props.name,
        control: props.control,
        rules: { required: props.requiredMessage },
        defaultValue: props.defaultValue?props.defaultValue:null,
    })

    return (
        <TimePickerComp
            {...inputProps}
            inputRef={ref}
            // disableClock={true}
            format="h:m a"
            className="react-time-picker"
            style={props.style}
            onChange={props.onChange}
            defaultValue={props.defaultValue?props.defaultValue:null}
            // value={props.value}
        />
    )
}