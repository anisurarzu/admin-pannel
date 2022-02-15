import Axios from 'axios'
import { api } from '../api'
import { toast } from 'react-toastify'
import { errorHandeller } from './Error'
import 'react-toastify/dist/ReactToastify.css'
toast.configure({ autoClose: 2000 })

// List of products
const Index = async (query, header) => {
    try {
        const response = await Axios.get(`${api}product/pending/items?${query}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Search product in vendor pending
const Search = async (data, header) => {
    try {
        const response = await Axios.get(`${api}product/pending/search/items?query=${data}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}


// Update request status
const Update = async (id, header) => {
    try {
        const response = await Axios.get(`${api}product/pending/${id}`, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}


const PendingProduct = {
    Index,
    Search,
    Update
}

export default PendingProduct