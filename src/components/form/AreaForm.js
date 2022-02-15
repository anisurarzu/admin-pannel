import React, { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { FormGroup } from '../formGroup'
import { Container } from '../container'
import { Text } from '../text'
import { SearchableSelect, SingleSelect } from '../select'
import Requests from '../../utils/Requests/Index'
import { useEffect } from 'react'

export const AreaForm = (props) => {
  const { register, handleSubmit, setError, clearErrors, errors } = useForm()
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const areaData = props.areaData ? props.areaData : null
  const [division, setDivision] = useState([])
  const [selectedDivision, setSelectedDivision] = useState(null)
  const [header] = useState({
    headers: { Authorization: "Bearer " + localStorage.getItem('token') }
  })
  // Handle district search
  const handleDistrictSearch = async (inputValue) => {
    try {
      const items = []
      const response = await Requests.Services.Shipping.District.Search(inputValue, header)
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
      return items
    } catch (error) {
      if (error) return []
    }
  }
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
    if (areaData && areaData.district) {
      setSelectedDistrict(areaData.district._id)
    }
    if (areaData && areaData.division) {
      setSelectedDivision(areaData.division._id)
    }
  }, [areaData])

  useEffect(() => {
    fetchData(1)
  }, [header, fetchData])



  // District form submit
  const onSubmit = async data => {
    let is_error = false


    if (!selectedDistrict) {
      setError("selectedDistrict", {
        type: "manual",
        message: "District is required"
      })
      is_error = true
    }

    if (!selectedDivision) {
      setError("selectedDivision", {
        type: "manual",
        message: "Division is required."
      })
      is_error = true
    }

    if (is_error) return

    let formData = {
      ...data,
      district: selectedDistrict,
      division: selectedDivision
    }
    props.submit(formData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container.Row>
        {/* upazila */}
        <Container.Column className="col-lg-6">
          <FormGroup>
            {errors.upazila && errors.upazila.message ?
              <Text className="text-danger fs-13 mb-0">{errors.upazila && errors.upazila.message}</Text>
              : <Text className="fs-13 mb-0">Thana name (EN) <span className="text-danger">*</span></Text>}
            <input
              type="text"
              name="upazila"
              className={errors.upazila ? "form-control shadow-none error" : "form-control shadow-none"}
              placeholder="Enter thana english name"
              defaultValue={areaData ? areaData.upazila : null}
              ref={register({ required: "Thana name (EN) is required" })}
            />
          </FormGroup>
        </Container.Column>

        {/* upazila bengali name */}
        <Container.Column className="col-lg-6">
          <FormGroup>
            {errors.upazila_bn_name && errors.upazila_bn_name.message ?
              <Text className="text-danger fs-13 mb-0">{errors.upazila_bn_name && errors.upazila_bn_name.message}</Text>
              : <Text className="fs-13 mb-0">Thana name (BN) <span className="text-danger">*</span></Text>}
            <input
              type="text"
              name='upazila_bn_name'
              className={errors.upazila_bn_name ? "form-control shadow-none error" : "form-control shadow-none"}
              placeholder="Enter thana bengali name"
              defaultValue={areaData ? areaData.upazila_bn_name : null}
              ref={register({ required: "Thana name (BN) is required" })}
            />
          </FormGroup>
        </Container.Column>

        {/* post office */}
        <Container.Column className="col-lg-6">
          <FormGroup>
            {errors.post_office && errors.post_office.message ?
              <Text className="text-danger fs-13 mb-0">{errors.post_office && errors.post_office.message}</Text>
              : <Text className="fs-13 mb-0">Post office name (EN) <span className="text-danger">*</span></Text>}
            <input
              type="text"
              name="post_office"
              className={errors.post_office ? "form-control shadow-none error" : "form-control shadow-none"}
              placeholder="Enter post office english name"
              defaultValue={areaData ? areaData.post_office : null}
              ref={register({ required: "Post office name (EN) is required" })}
            />
          </FormGroup>
        </Container.Column>

        {/* post office bengali name */}
        <Container.Column className="col-lg-6">
          <FormGroup>
            {errors.post_office_bn_name && errors.post_office_bn_name.message ?
              <Text className="text-danger fs-13 mb-0">{errors.post_office_bn_name && errors.post_office_bn_name.message}</Text>
              : <Text className="fs-13 mb-0">Post office name (BN) <span className="text-danger">*</span></Text>}
            <input
              type="text"
              name='post_office_bn_name'
              className={errors.post_office_bn_name ? "form-control shadow-none error" : "form-control shadow-none"}
              placeholder="Enter post office bengali name"
              defaultValue={areaData ? areaData.post_office_bn_name : null}
              ref={register({ required: "Post office name (BN) is required" })}
            />
          </FormGroup>
        </Container.Column>

        {/* post code */}
        <Container.Column className="col-lg-6">
          <FormGroup>
            {errors.post_code && errors.post_code.message ?
              <Text className="text-danger fs-13 mb-0">{errors.post_code && errors.post_code.message}</Text>
              : <Text className="fs-13 mb-0">Post code <span className="text-danger">*</span></Text>}
            <input
              type="number"
              name="post_code"
              className={errors.post_code ? "form-control shadow-none error" : "form-control shadow-none"}
              placeholder="Enter post code"
              defaultValue={areaData ? areaData.post_code : null}
              ref={register({ required: "Post code is required" })}
            />
          </FormGroup>
        </Container.Column>

        {/* select district */}
        <Container.Column className="col-lg-6">
          <FormGroup>
            {errors.selectedDistrict && errors.selectedDistrict.message ?
              <Text className="text-danger fs-13 mb-0">{errors.selectedDistrict && errors.selectedDistrict.message}</Text>
              : <Text className="fs-13 mb-0"> District <span className="text-danger">*</span></Text>}

            <SearchableSelect
              placeholder="Search district"
              defaultValue={areaData && areaData.district ?
                {
                  label: areaData.district.name,
                  value: areaData.district._id
                }
                : null}
              search={inputValue => handleDistrictSearch(inputValue)}
              values={data => {
                setSelectedDistrict(data.value)
                if (data.value) {
                  clearErrors("selectedDistrict")
                }
              }
              }
              borderRadius={5}
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
              deafult={areaData && areaData.division ?
                {
                  value: areaData.division._id ? areaData.division._id : null,
                  label: areaData.division.name ? areaData.division.name : null
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
