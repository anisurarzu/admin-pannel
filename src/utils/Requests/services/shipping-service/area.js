import Axios from 'axios'
import { ShippingService } from '../../../api'
import { toast } from 'react-toastify'
import { errorHandeller } from '../../Error'
import 'react-toastify/dist/ReactToastify.css'
toast.configure({ autoClose: 2000 })

// Index of items
const Index = async (page, limit, header) => {
    try {
        const response = await Axios.get(`${ShippingService}area?page=${page}&limit=${limit}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Show specific item
const Show = async (id, header) => {
    try {
        const response = await Axios.get(`${ShippingService}area/${id}`, header)
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
        const response = await Axios.post(`${ShippingService}area`, data, header)
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
        const response = await Axios.put(`${ShippingService}area/${id}`, data, header)
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
        const response = await Axios.delete(`${ShippingService}area/${id}`, header)
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
        const response = await Axios.get(`${ShippingService}area?query=${data}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Search by district item
const SearchbyDistrict = async (query, data, header) => {
    try {
        let queryData= JSON.stringify({
            query:query,
            district:data
        })
        const response = await Axios.get(`${ShippingService}area?query=${queryData}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

export const Area = {
    Index,
    Search,
    Store,
    Show,
    Update,
    Delete,
    SearchbyDistrict
    // Filter,
    // FilterByDateRange
}
