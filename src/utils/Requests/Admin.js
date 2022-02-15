import Axios from 'axios'
import { api } from '../api'
import { toast } from 'react-toastify'
import { errorHandeller } from './Error'
import 'react-toastify/dist/ReactToastify.css'
toast.configure({ autoClose: 2000 })

// List of admin
const Index = async (page, limit, header) => {
    try {
        const response = await Axios.get(`${api}admin/index?page=${page}&limit=${limit}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Show specific admin
const Show = async (id, header) => {
    try {
        const response = await Axios.get(`${api}admin/show/${id}`, header)
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Store admin
const Store = async (data, header) => {
    try {
        const response = await Axios.post(`${api}admin/create`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update specific admin
const Update = async (id, data, header) => {
    try {
        const response = await Axios.put(`${api}admin/update/${id}`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Search item
const Search = async (data, header) => {
    try {
        const response = await Axios.get(`${api}admin/search/items?query=${data}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}


const Admin = {
    Index,
    Show,
    Store,
    Update,
    Search
}

export default Admin