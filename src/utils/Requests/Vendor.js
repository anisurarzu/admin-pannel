import Axios from 'axios'
import { api } from '../api'
import { toast } from 'react-toastify'
import { errorHandeller } from './Error'
import 'react-toastify/dist/ReactToastify.css'
toast.configure({ autoClose: 2000 })

// List of vendors
const Index = async (page, limit, header) => {
    try {
        const response = await Axios.get(`${api}vendor?page=${page}&limit=${limit}`, header)
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// List of all vendors
const IndexAll = async (header) => {
    try {
        const response = await Axios.get(`${api}vendor/all`, header)
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Store vendor
const Store = async (data, header) => {
    try {
        const response = await Axios.post(`${api}vendor`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Show specific vendor
const Show = async (id, header) => {
    try {
        const response = await Axios.get(`${api}vendor/${id}`, header)
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update specific vendor
const Update = async (id, data, header) => {
    try {
        const response = await Axios.put(`${api}vendor/${id}`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Search vendor
const Search = async (data, header) => {
    try {
        const response = await Axios.get(`${api}vendor/search/items?query=${data}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Upload xlsx
const UploadXlsx = async (data, header) => {
    try {
        const response = await Axios.post(`${api}vendor/upload/xlsx`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

const UpdateImage = async (id, data, header) => {
    try {
        const response = await Axios.put(`${api}vendor/image/${id}`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

const Vendor = {
    Index,
    IndexAll,
    Show,
    Store,
    Update,
    Search,
    UploadXlsx,
    UpdateImage
}

export default Vendor