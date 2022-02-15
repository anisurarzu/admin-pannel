import React from 'react'
import './style.scss'
import { SingleSelect } from '../../select'

const Emi = (props) => {
    const options = [
        { label: '3 Month', value: 3 },
        { label: '6 Month', value: 6 },
        { label: '12 Month', value: 12 },
        { label: '18 Month', value: 18 },
        { label: '24 Month', value: 24 },
        { label: '36 Month', value: 36 }
    ]

    return (
        <div className="return-policy product-material-inputs">
            <div className="container-fluid mb-4">
                <div className="row">
                    <div className="col-12 py-3 border-bottom">
                        <h6 className="mb-0">EMI policy</h6>
                    </div>
                    <div className="col-12 py-3">

                        <div className="form-group mb-4">
                            <p>EMI Amount</p>

                            <input
                                type="number"
                                placeholder="Enter EMI amount"
                                className="form-control shadow-none"
                                defaultValue={props.deafult ? props.deafult.amount : null}
                                onChange={(event) =>
                                    props.data({ ...props.data, amount: event.target.value })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <p>EMI Duration</p>
                            <SingleSelect
                                options={options}
                                error={props.error}
                                placeholder={'duration'}
                                value={(event) => props.data({ ...props.data, duration: event.value })}
                                deafult={props.deafult && props.deafult.duration ? [{ _id: props.deafult.duration, name: props.deafult.duration + ' Month' }] : null}
                            />
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default Emi;