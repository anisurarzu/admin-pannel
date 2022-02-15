import Axios from 'axios'
import { api } from '../api'
import { toast, Slide } from 'react-toastify'
import { errorHandeller } from './Error'
import 'react-toastify/dist/ReactToastify.css'

const toastSetting = {
    autoClose: 2000,
    transition: Slide,
    position: "bottom-right",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
}

// Index of items
const Index = async (header) => {
    try {
        const response = await Axios.get(`${api}category`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Show specific item
const Show = async (id, type, header) => {
    try {
        const response = await Axios.get(`${api}category/${type}/${id}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Store item
const Store = async (data, header) => {
    try {
        const response = await Axios.post(`${api}category`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message, { ...toastSetting })
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update specific item
const Update = async (id, type, data, header) => {
    try {
        const response = await Axios.put(`${api}category/${type}/${id}`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message, { ...toastSetting })
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update item image
const UpdateImage = async (id, type, data, header) => {
    try {
        const response = await Axios.put(`${api}category/image/${type}/${id}`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message, { ...toastSetting })
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update item index
const UpdateIndex = async (data, header) => {
    try {
        const response = await Axios.put(`${api}category/update-index`, { data }, header)
        if (response.status === 201) return response
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

const Category = {
    Index,
    Show,
    Store,
    Update,
    UpdateImage,
    UpdateIndex
}

export default Category