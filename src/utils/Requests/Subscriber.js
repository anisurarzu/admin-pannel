import Axios from 'axios'
import { api } from '../api'
import { toast } from 'react-toastify'
import { errorHandeller } from './Error'
import 'react-toastify/dist/ReactToastify.css'
toast.configure({ autoClose: 2000 })

// List of subscribers
const Index = async (page, limit, header) => {
    try {
        const response = await Axios.get(`${api}subscriber?page=${page}&limit=${limit}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Search item
const Search = async (data, header) => {
    try {
        const response = await Axios.get(`${api}subscriber/search/items?query=${data}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Filter by date
const FilterByDateRange = async (data, header) => {
    try {
        const response = await Axios.post(`${api}subscriber/filter-by-date-range`, data, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

const Subscriber = {
    Index,
    Search,
    FilterByDateRange
}

export default Subscriber