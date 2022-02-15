import Axios from 'axios'
import { api } from '../api'
import { toast } from 'react-toastify'
import { errorHandeller } from './Error'
import 'react-toastify/dist/ReactToastify.css'
toast.configure({ autoClose: 2000 })

// List of items
const Index = async (page, limit, header) => {
    try {
        const response = await Axios.get(`${api}shipping?page=${page}&limit=${limit}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Store items
const Store = async (data, header) => {
    try {
        const response = await Axios.post(`${api}shipping`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Show specifi items
const Show = async (id, header) => {
    try {
        const response = await Axios.get(`${api}shipping/${id}`, header)
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
        const response = await Axios.put(`${api}shipping/${id}`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Delete item
const Delete = async (id, header) => {
    try {
        const response = await Axios.delete(`${api}shipping/${id}`, header)
        if (response.status === 200) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Filter 
const Filter = async (data, header) => {
    try {
        const response = await Axios.get(`${api}shipping/filter/items?value=${data.value}&field=${data.field}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Filter by date
const FilterByDateRange = async (data, header) => {
    try {
        const response = await Axios.post(`${api}shipping/date-range-filter`, data, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

const Coupon = {
    Index,
    Store,
    Show,
    Update,
    Delete,
    Filter,
    FilterByDateRange
}

export default Coupon