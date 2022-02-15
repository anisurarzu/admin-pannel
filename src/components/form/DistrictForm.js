import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormGroup } from '../formGroup'
import { Container } from '../container'
import { Text } from '../text'
import { SingleSelect } from '../select'
import Requests from '../../utils/Requests/Index'

export const DistrictForm = (props) => {
  const { register, handleSubmit, clearErrors, setError, errors } = useForm()
  const districtData = props.districtData ? props.districtData : {}
  const [division, setDivision] = useState([])
  const [selectedDivision, setSelectedDivision] = useState(null)
  const [header] = useState({
    headers: { Authorization: "Bearer " + localStorage.getItem('token') }
  })

  // Fetch division data
  const fetchData = useCallback(async (page) => {
    try {
      const items = []
      const response = await Requests.Services.Shipping.Division.Index(page, 10, header)
      if (response) {
        if (response.data && response.data.length > 0) {
          for (let i = 0; i < response.data.length; i++) {
            const element = response.data[i]
            items.push({
              label: element.name,
              value: element._id,
            })
          }
        }
      }
      setDivision(items)
    } catch (error) {
      if (error) console.log(error);
    }
  }, [header])

  useEffect(() => {
    if (districtData && districtData.division) {
      setSelectedDivision(districtData.division._id)
    }
  }, [districtData])

  useEffect(() => {
    fetchData(1)
  }, [header, fetchData])

  // District form submit
  const onSubmit = async data => {
    let is_error = false

    if (!selectedDivision) {
      setError("selectedDivision", {
        type: "manual",
        message: "Division is required."
      })
      is_error = true
    }

    if (is_error) return


    const formData = {
      ...data,
      division: selectedDivision
    }
    // console.log(formData);
    props.submit(formData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container.Row>

        {/* Name */}
        <Container.Column>
          <FormGroup>
            {errors.name && errors.name.message ?
              <Text className="text-danger fs-13 mb-0">{errors.name && errors.name.message}</Text>
              : <Text className="fs-13 mb-0">District name (EN) <span className="text-danger">*</span></Text>}
            <input
              type="text"
              name="name"
              className={errors.name ? "form-control shadow-none error" : "form-control shadow-none"}
              placeholder="Enter district english name"
              defaultValue={districtData ? districtData.name : null}
              ref={register({ required: "District name (EN) is required" })}
            />
          </FormGroup>
        </Container.Column>

        {/* Bengali name */}
        <Container.Column>
          <FormGroup>
            {errors.bn_name && errors.bn_name.message ?
              <Text className="text-danger fs-13 mb-0">{errors.bn_name && errors.bn_name.message}</Text>
              : <Text className="fs-13 mb-0">District name (BN) <span className="text-danger">*</span></Text>}
            <input
              type="text"
              name='bn_name'
              className={errors.bn_name ? "form-control shadow-none error" : "form-control shadow-none"}
              placeholder="Enter district bengali name"
              defaultValue={districtData ? districtData.bn_name : null}
              ref={register({ required: "District name (BN) is required" })}
            />
          </FormGroup>
        </Container.Column>

        {/* Division */}
        <Container.Column >
          <FormGroup>
            {errors.selectedDivision && errors.selectedDivision.message ?
              <Text className="text-danger fs-13 mb-0">{errors.selectedDivision && errors.selectedDivision.message}</Text>
              : <Text className="fs-13 mb-0">Division <span className="text-danger">*</span></Text>}
            <SingleSelect
              placeholder=" division"
              deafult={districtData && districtData.division ?
                {
                  value: districtData.division._id ? districtData.division._id : null,
                  label: districtData.division.name ? districtData.division.name : null
                } : null}
              options={division}
              value={event => {
                setSelectedDivision(event.value)
                clearErrors("selectedDivision")
              }}
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
