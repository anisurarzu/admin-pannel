import Axios from 'axios'
import { ShippingApi } from '../../api'
import { toast } from 'react-toastify'
import { errorHandeller } from '../Error'
import 'react-toastify/dist/ReactToastify.css'
toast.configure({ autoClose: 2000 })

// Index of items
const Index = async (page, limit, header) => {
    try {
        // const response = await Axios.get(`${ShippingApi}district?page=${page}&limit=${limit}`, header)
        const response = await Axios.get(`${ShippingApi}district?page=${page}&limit=${limit}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Show specific item
const Show = async (id, header) => {
    try {
        const response = await Axios.get(`${ShippingApi}district/${id}`, header)
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Store item
const Store = async (data, header) => {
    try {
        const response = await Axios.post(`${ShippingApi}district`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update specific item
const Update = async (id, data, header) => {
    try {
        const response = await Axios.put(`${ShippingApi}district/${id}`, data, header)
        if (response.status === 200) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update item image
// const UpdateImage = async (id, data, header) => {
//     try {
//         const response = await Axios.put(`${ShippingApi}brand/image/${id}`, data, header)
//         if (response.status === 201) {
//             return response.data
//         }
//     } catch (error) {
//         if (error) return errorHandeller(error)
//     }
// }

// Delete item
const Delete = async (id, header) => {
    try {
        const response = await Axios.delete(`${ShippingApi}district/${id}`, header)
        if (response.status === 200) {
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
        const response = await Axios.get(`${ShippingApi}district?query=${data}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}
const District = {
    Index,
    Search,
    Store,
    Show,
    Update,
    Delete,
    // Filter,
    // FilterByDateRange
}

export default District