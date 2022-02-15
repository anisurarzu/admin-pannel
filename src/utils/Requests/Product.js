import Axios from 'axios'
import { api } from '../api'
import { toast } from 'react-toastify'
import { errorHandeller } from './Error'
import 'react-toastify/dist/ReactToastify.css'
toast.configure({ autoClose: 2000 })

// List of products
const Index = async (query, header) => {
    try {
        const response = await Axios.get(`${api}product?${query}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Store product
const Store = async (data, header) => {
    try {
        const response = await Axios.post(`${api}product`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Show specific product
const Show = async (id, header) => {
    // const response = await Axios.get(`${api}product/${id}`, header)
    // return response

    try {
        const response = await Axios.get(`${api}product/${id}`, header)
        if (response.status === 200) {
            return response
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update specific product
const Update = async (id, data, header) => {
    try {
        const response = await Axios.put(`${api}product/${id}`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update specific product thumbnail
const UpdateThumb = async (id, data, header) => {
    try {
        const response = await Axios.put(`${api}product/thumb/update/${id}`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Add product additional thumbnails
const AddThumb = async (id, data, header) => {
    try {
        const response = await Axios.put(`${api}product/thumb/additional/${id}`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Remove product additional thumbnail
const RemoveAdditionalThumb = async (id, data, header) => {
    try {
        const response = await Axios.delete(`${api}product/thumb/additional/remove/${data}/${id}`, header)
        if (response.status === 200) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Search product with name or sku
const Search = async (data, header) => {
    try {
        const response = await Axios.get(`${api}product/search/items?query=${data}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update active / deactive
const UpdateStatus = async (id, header) => {
    try {
        const response = await Axios.get(`${api}product/active/${id}`, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Filter Item
const FilterItem = async (data, header) => {
    try {
        const response = await Axios.post(`${api}product/search/${data.field}`, { query: data.query }, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Filter Products
const FilterProducts = async (data, header) => {
    try {
        const response = await Axios.get(`${api}product/filter/${data.value}/${data.field}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Upload description images
const UploadDescImage = async (id, data, header) => {
    try {
        const response = await Axios.put(`${api}product/desc-image/${id}`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Audit specific item
const Audit = async (id, header) => {
    try {
        const response = await Axios.get(`${api}product/audit/${id}`, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Change product slug
const ChangeSlug = async (id, data, header) => {
    try {
        const response = await Axios.put(`${api}product/change-slug/${id}`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}


const Product = {
    Index,
    Show,
    Store,
    Update,
    UpdateThumb,
    AddThumb,
    RemoveAdditionalThumb,
    Search,
    UpdateStatus,
    FilterItem,
    FilterProducts,
    UploadDescImage,
    Audit,
    ChangeSlug
}

export default Product