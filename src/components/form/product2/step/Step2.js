import React, { useState } from 'react'
import Icon from 'react-icons-kit'
import { chevronsRight, plus } from 'react-icons-kit/feather'
import { CustomButton } from '../../../button'
import { Container } from '../../../container'
import { SearchableSelect } from '../../../select'

import Requests from '../../../../utils/Requests/Index'
import { x } from 'react-icons-kit/feather'

export const Step2 = (props) => {
    const [category, setCategory] = useState([
        {
            mainCategory: null,
            mainCategoryName: null,
            subCategory: null,
            subCategoryName: null,
            leafCategory: null,
            leafCategoryName: null,
            error: null
        }
    ])
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // increase category
    const increaseCategory = () => {
        setCategory([...category, {
            mainCategory: null,
            mainCategoryName: null,
            subCategory: null,
            subCategoryName: null,
            leafCategory: null,
            leafCategoryName: null,
            error: null
        }])
    }

    // decrease category
    const decreaseCategory = (index) => {
        const fields = [...category]
        fields.splice(index, 1)
        setCategory(fields)
    }

    // Handle filter
    const handleFilter = async ({ inputValue, field }) => {
        let response

        if (field === "main-category") response = await Requests.Options.Category(inputValue, header)
        if (field === "sub-category") response = await Requests.Options.SubCategory(inputValue, header)
        if (field === "leaf-category") response = await Requests.Options.LeafCategory(inputValue, header)

        if (response.data && response.data.length) return response.data
        return []
    }

    // Submit Data & go next
    const onSubmit = async event => {
        event.preventDefault()
        if (!category.mainCategory) return setCategory(exCategory => ({ ...exCategory, value: null, error: "Main category is required." }))

        const formData = {
            mainCategory: category.mainCategory
        }

        console.log(formData)
        // props.nextStep()
    }


    return (
        <div>

            {/* Step header */}
            <div className="d-flex mb-3">
                <div><h6 className="text-muted mb-0">{props.title}</h6></div>
                <div className="ml-auto">

                    {/* Category increase button */}
                    <CustomButton
                        className="btn-primary rounded-circle border-0 circle__padding__sm"
                        onClick={increaseCategory}
                    >
                        <Icon icon={plus} size={18} />
                    </CustomButton>
                </div>
            </div>

            <form onSubmit={onSubmit}>

                {/* Category value fields */}
                {category && category.map((item, i) =>
                    <Container.Row
                        key={i}
                        className="mb-4"
                    >

                        {/* Main Category */}
                        <Container.Column>
                            <div className="d-flex">
                                <div className="flex-fill">
                                    <div className="form-group mb-4">
                                        {category.error ? <p className="text-danger">{category.error}</p> : <p>Main category</p>}

                                        <SearchableSelect
                                            borderRadius={4}
                                            placeholder={'Select Main-Category'}
                                            search={inputValue => handleFilter({ inputValue, field: "main-category" })}
                                            values={data => setCategory(exCategory => ({
                                                ...exCategory,
                                                mainCategory: data.value,
                                                mainCategoryName: data.label,
                                                error: null
                                            }))}
                                        />
                                    </div>
                                </div>

                                {/* Category decrease button */}
                                {i > 0 &&
                                    <div className="pt-4 pl-2">
                                        <CustomButton
                                            className="btn-danger rounded-circle border-0 circle__padding__sm"
                                            onClick={() => decreaseCategory(i)}
                                        >
                                            <Icon icon={x} size={18} />
                                        </CustomButton>
                                    </div>
                                }
                            </div>
                        </Container.Column>

                        {/* Sub Category */}
                        <Container.Column>
                            <div className="form-group mb-4">
                                <p>Sub category</p>

                                <SearchableSelect
                                    borderRadius={4}
                                    placeholder={'Select Sub-Category'}
                                    search={inputValue => handleFilter({ inputValue, field: "sub-category" })}
                                    values={data => setCategory(exCategory => ({
                                        ...exCategory,
                                        subCategory: data.value,
                                        subCategoryName: data.label
                                    }))}
                                />
                            </div>
                        </Container.Column>

                        {/* Leaf Category */}
                        <Container.Column>
                            <div className="form-group mb-4">
                                <p>Leaf category</p>

                                <SearchableSelect
                                    borderRadius={4}
                                    placeholder={'Select Leaf-Category'}
                                    search={inputValue => handleFilter({ inputValue, field: "leaf-category" })}
                                    values={data => setCategory(exCategory => ({
                                        ...exCategory,
                                        leafCategory: data.value,
                                        leafCategoryName: data.label
                                    }))}
                                />
                            </div>
                        </Container.Column>
                    </Container.Row>
                )}

                {/* Selected category name flow */}
                <Container.Row>
                    <Container.Column>
                        <div className="d-flex">
                            {category.mainCategoryName &&
                                <div>
                                    <p
                                        className="text-info"
                                        style={{ fontSize: 14 }}
                                    >
                                        <b>{category.mainCategoryName}</b>
                                    </p>
                                </div>
                            }

                            {category.subCategoryName &&
                                <div>
                                    <p
                                        className="text-info"
                                        style={{ fontSize: 14 }}
                                    >
                                        <Icon icon={chevronsRight} className="text-dark" />
                                        <b>{category.subCategoryName}</b>
                                    </p>
                                </div>
                            }

                            {category.leafCategoryName &&
                                <div>
                                    <p
                                        className="text-info"
                                        style={{ fontSize: 14 }}
                                    >
                                        <Icon icon={chevronsRight} className="text-dark" />
                                        <b>{category.leafCategoryName}</b>
                                    </p>
                                </div>
                            }
                        </div>
                    </Container.Column>

                    {/* Submit & go next */}
                    <Container.Column className="text-right">
                        <CustomButton
                            type="button"
                            className="btn-primary border-0 mr-2"
                            onClick={() => props.previousStep()}
                        >Prev</CustomButton>
                        <CustomButton
                            type="submit"
                            className="btn-success border-0"
                        >Next</CustomButton>
                    </Container.Column>

                </Container.Row>
            </form >
        </div >
    );
}
