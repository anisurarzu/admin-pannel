import React from 'react'
import { useForm } from 'react-hook-form'
import { Text } from '../../text'
import { FormGroup } from '../../formGroup'
import { CustomButton } from '../../button'
import { Container } from '../../container'

export const AreaForm = (props) => {
    const { register, handleSubmit, errors } = useForm()

    // Submit Form
    const onSubmit = data => props.onSubmit(data)

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container.Row>

                    {/* Upazila */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.upazila && errors.upazila.message ?
                                <Text className="mb-0 fs-13 text-danger">{errors.upazila.message}</Text> :
                                <Text className="mb-0 fs-13 text-muted">Upazila name</Text>
                            }

                            <input
                                type="text"
                                name="upazila"
                                className="form-control shadow-none"
                                placeholder="Enter upazila name"
                                defaultValue={props.data ? props.data.upazila : null}
                                ref={register({ required: "Upazila name is required" })}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Upazila bengali name */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.upazila_bn_name && errors.upazila_bn_name.message ?
                                <Text className="mb-0 fs-13 text-danger">{errors.upazila_bn_name.message}</Text> :
                                <Text className="mb-0 fs-13 text-muted">Upazila bengali name</Text>
                            }

                            <input
                                type="text"
                                name="upazila_bn_name"
                                className="form-control shadow-none"
                                placeholder="Enter upazila bengali name"
                                defaultValue={props.data ? props.data.upazila_bn_name : null}
                                ref={register({ required: "Upazila bengali name is required" })}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Post office */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.post_office && errors.post_office.message ?
                                <Text className="mb-0 fs-13 text-danger">{errors.post_office.message}</Text> :
                                <Text className="mb-0 fs-13 text-muted">Post office name</Text>
                            }

                            <input
                                type="text"
                                name="post_office"
                                className="form-control shadow-none"
                                placeholder="Enter post office name"
                                defaultValue={props.data ? props.data.post_office : null}
                                ref={register({ required: "Post office name is required" })}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Post office bengali name */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.post_office_bn_name && errors.post_office_bn_name.message ?
                                <Text className="mb-0 fs-13 text-danger">{errors.post_office_bn_name.message}</Text> :
                                <Text className="mb-0 fs-13 text-muted">Post office bengali name</Text>
                            }

                            <input
                                type="text"
                                name="post_office_bn_name"
                                className="form-control shadow-none"
                                placeholder="Enter post office bengali name"
                                defaultValue={props.data ? props.data.post_office_bn_name : null}
                                ref={register({ required: "Post office bengali name is required" })}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Post code */}
                    <Container.Column className="col-lg-6">
                        <FormGroup>
                            {errors.post_code && errors.post_code.message ?
                                <Text className="mb-0 fs-13 text-danger">{errors.post_code.message}</Text> :
                                <Text className="mb-0 fs-13 text-muted">Post code</Text>
                            }

                            <input
                                type="text"
                                name="post_code"
                                className="form-control shadow-none"
                                placeholder="Enter post code"
                                defaultValue={props.data ? props.data.post_code : null}
                                ref={register({ required: "Post code is required" })}
                            />
                        </FormGroup>
                    </Container.Column>

                    {/* Submit button */}
                    <Container.Column className="text-right">
                        <CustomButton
                            type="submit"
                            className="btn-primary border-0"
                            disabled={props.loading}
                        >
                            <Text className="fs-15 mb-0">{props.loading ? "Creating..." : "Create"}</Text>
                        </CustomButton>
                    </Container.Column>
                </Container.Row>
            </form>
        </div>
    );
}
