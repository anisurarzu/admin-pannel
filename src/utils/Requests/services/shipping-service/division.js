import Axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ShippingService } from '../../../api'
import { errorHandeller } from '../../Error'
toast.configure({ autoClose: 2000 })

// Index of items
const Index = async (page, limit, header) => {
    try {
        const response = await Axios.get(`${ShippingService}division?page=${page}&limit=${limit}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Show specific item
const Show = async (id, header) => {
    try {
        const response = await Axios.get(`${ShippingService}division/${id}`, header)
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
        const response = await Axios.post(`${ShippingService}division`, data, header)
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
        const response = await Axios.put(`${ShippingService}division/${id}`, data, header)
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
//         const response = await Axios.put(`${ShippingService}brand/image/${id}`, data, header)
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
        const response = await Axios.delete(`${ShippingService}division/${id}`, header)
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
        const response = await Axios.get(`${ShippingService}division?query=${data}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}
export const Division = {
    Index,
    Search,
    Store,
    Show,
    Update,
    Delete,
    // Filter,
    // FilterByDateRange
}
