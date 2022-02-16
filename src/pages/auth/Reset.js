import React, { useState } from 'react'
import './style.scss'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Images } from '../../utils/Images'
import Requests from '../../utils/Requests/Index'

toast.configure({ autoClose: 2000 })

const Login = () => {
    const { register, handleSubmit, errors } = useForm()
    const [isLoading, setLoading] = useState(false)

    // Submit data
    const onSubmit = async (data) => {
        try {
            setLoading(true)
            const response = await Requests.Auth.Reset(data)
            if (response && response.status === 201) {
                toast.success(response.data.message)
            }
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)

                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message)
                }
            }
        }
    }

    return (
        <div className="auth">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-lg-6 d-none d-lg-block p-0">
                        <div className="image-container">
                            <div className="overlay">
                                <div className="flex-center flex-column">
                                    <img src={Images.Logo} className="img-fluid" alt="..." />
                                    <h2>admin panel</h2>
                                    <p>Login as admin, manage users & products.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6 py-3 credential-container">
                        <div className="flex-center flex-column">
                            <div className="card border-0">
                                <div className="text-center text-lg-left">
                                    <div className="d-lg-none">
                                        <img src={Images.Logo} className="img-fluid" alt="..." />
                                    </div>
                                    <h3 className="mb-0 mt-3">Recover Password!</h3>
                                    <p className="mb-4">Enter your Email and instructions will be sent to you!</p>
                                </div>


                                <form onSubmit={handleSubmit(onSubmit)}>

                                    {/* E-mail */}
                                    <div className="form-group mb-4">
                                        {errors.email && errors.email.message ? (
                                            <p className="text-danger">{errors.email && errors.email.message}</p>
                                        ) : <p>E-mail</p>
                                        }

                                        <input
                                            type="text"
                                            name="email"
                                            className="form-control shadow-none"
                                            placeholder="Enter e-mail"
                                            ref={register({
                                                required: "E-mail is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Invalid email address"
                                                }
                                            })}
                                        />
                                    </div>

                                    <div className="d-flex">
                                        <div>
                                            <Link to="/">Go to Login</Link>
                                        </div>
                                        <div className="ml-auto">
                                            <button type="submit" className="btn shadow-none" disabled={isLoading}>
                                                {isLoading ? <span>Sending...</span> : <span>Reset</span>}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;