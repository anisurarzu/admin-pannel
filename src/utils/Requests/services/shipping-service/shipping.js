import Axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ShippingService } from '../../../api'
import { errorHandeller } from '../../Error'
toast.configure({ autoClose: 2000 })

// List of items
const Index = async (query, header) => {
    try {
        const response = await Axios.get(`${ShippingService}shipping?${query}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Store items
const Store = async (data, header) => {
    try {
        const response = await Axios.post(`${ShippingService}shipping`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) {
            return errorHandeller(error)
        }
    }
}

// Show specifi items
const Show = async (id, header) => {
    try {
        const response = await Axios.get(`${ShippingService}shipping/${id}`, header)
        if (response.status === 200) {
            return response.data.data
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update specific items
const Update = async (id, data, header) => {
    try {
        const response = await Axios.put(`${ShippingService}shipping/${id}`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) {
            console.log(error.response)
            return errorHandeller(error)
        }
    }
}

// Delete item
const Delete = async (id, header) => {
    try {
        const response = await Axios.delete(`${ShippingService}shipping/${id}`, header)
        if (response.status === 200) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Filter 
const Filter = async (page, limit, data, header) => {
    try {
        const response = await Axios.get(`${ShippingService}shipping?page=${page}&limit=${limit}&${data.field}=${data.value}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Filter by date
const FilterByDateRange = async (data, header) => {
    try {
        const response = await Axios.post(`${ShippingService}shipping/date-range-filter`, data, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// get district by divisions items
const DistrictsByDivision = async (data, header) => {
    try {
        const response = await Axios.post(`${ShippingService}get-district-by-division`, data, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) {
            return errorHandeller(error)
        }
    }
}

// get areas by disttricts items
const AreasByDistrict = async (data, header) => {
    try {
        const response = await Axios.post(`${ShippingService}get-area-by-district`, data, header)
        if (response.status === 200) return response.data

    } catch (error) {
        if (error) {
            return errorHandeller(error)
        }
    }
}

// Index of division
const DivisionList = async (header) => {
    try {
        const response = await Axios.get(`${ShippingService}division`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// get district by division
const DistrictList = async (id, header) => {
    try {
        const response = await Axios.get(`${ShippingService}get-district-by-division-cart/${id}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}


// get area by district
const AreaList = async (id, header) => {
    try {
        const response = await Axios.get(`${ShippingService}get-area-by-district-cart/${id}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

export const MainShipping = {
    Index,
    Store,
    Show,
    Update,
    Delete,
    Filter,
    FilterByDateRange,
    DistrictsByDivision,
    AreasByDistrict,
    DivisionList,
    DistrictList,
    AreaList
}