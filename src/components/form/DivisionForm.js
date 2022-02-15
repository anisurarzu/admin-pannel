import React from 'react'
import { useForm } from 'react-hook-form'
import { FormGroup } from '../formGroup'
import { Container } from '../container'
import { Text } from '../text'

export const DivisionForm = (props) => {
  const { register, handleSubmit, errors } = useForm()
  const divisionData = props.divisionData ? props.divisionData : {}

  // District form submit
  const onSubmit = async data => {
    props.submit(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container.Row>

        {/* Name */}
        <Container.Column>
          <FormGroup>
            {errors.name && errors.name.message ?
              <Text className="text-danger fs-13 mb-0">{errors.name && errors.name.message}</Text>
              : <Text className="fs-13 mb-0">Division name (EN) <span className="text-danger">*</span></Text>}
            <input
              type="text"
              name="name"
              className={errors.name ? "form-control shadow-none error" : "form-control shadow-none"}
              placeholder="Enter division english name"
              defaultValue={divisionData ? divisionData.name : null}
              ref={register({ required: "Division name (EN) is required" })}
            />
          </FormGroup>
        </Container.Column>

        {/* Bengali name */}
        <Container.Column>
          <FormGroup>
            {errors.bn_name && errors.bn_name.message ?
              <Text className="text-danger fs-13 mb-0">{errors.bn_name && errors.bn_name.message}</Text>
              : <Text className="fs-13 mb-0">Division name (BN) <span className="text-danger">*</span></Text>}
            <input
              type="text"
              name='bn_name'
              className={errors.bn_name ? "form-control shadow-none error" : "form-control shadow-none"}
              placeholder="Enter division bengali name"
              defaultValue={divisionData ? divisionData.bn_name : null}
              ref={register({ required: "Division name (BN) is required" })}
            />
          </FormGroup>
        </Container.Column>

      </Container.Row>

      {/* Submit button */}
      <div className="text-right">
        <button
          type="submit"
          className="btn shadow-none text-uppercase"
          disabled={props.loading}
        ><Text className="fs-14 mb-0">
            {props.loading
              ? props.update
                ? "Updating ..."
                : "Submitting ..."
              : props.update
                ? "Update"
                : "Submit"}
          </Text></button>
      </div>
    </form>
  );
}
