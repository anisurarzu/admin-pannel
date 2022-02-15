import Axios from 'axios'
import { api } from '../api'
import { toast } from 'react-toastify'
import { errorHandeller } from './Error'
import 'react-toastify/dist/ReactToastify.css'
toast.configure({ autoClose: 2000 })

// List of items
const Index = async (page, limit, header) => {
    try {
        const response = await Axios.get(`${api}report/bestsale?page=${page}&limit=${limit}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Filter by fields
const FilterByFields = async (data, header) => {
    try {
        const response = await Axios.post(`${api}report/bestsale/filter-by-fields`, data, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Filter item by date
const FilterByDate = async (data, header) => {
    try {
        const response = await Axios.post(`${api}report/bestsale/filter-by-date-range`, data, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

const BestSale = {
    Index,
    FilterByFields,
    FilterByDate
}

export default BestSale