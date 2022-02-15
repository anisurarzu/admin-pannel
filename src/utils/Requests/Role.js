import Axios from 'axios'
import { aclApi } from '../api'
import { toast } from 'react-toastify'
import { errorHandeller } from './Error'
import 'react-toastify/dist/ReactToastify.css'
toast.configure({ autoClose: 2000 })

// Index of items
const Index = async (header) => {
    try {
        const response = await Axios.get(`${aclApi}role`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Index of routes
const Routes = async (header) => {
    try {
        const response = await Axios.get(`${aclApi}role/route/paths`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}


// Store item
const Store = async (data, header) => {
    try {
        const response = await Axios.post(`${aclApi}role`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Show item
const Show = async (id, header) => {
    try {
        const response = await Axios.get(`${aclApi}role/${id}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update specific items
const Update = async (id, data, header) => {
    try {
        const response = await Axios.put(`${aclApi}role/${id}`, data, header)
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
        const response = await Axios.delete(`${aclApi}role/${id}`, header)
        if (response.status === 200) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

const Role = {
    Index,
    Routes,
    Store,
    Show,
    Update,
    Delete
}

export default Role