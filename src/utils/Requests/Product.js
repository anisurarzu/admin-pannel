import Axios from 'axios'
import { api } from '../api'
import { toast } from 'react-toastify'
import { errorHandeller } from './Error'
import 'react-toastify/dist/ReactToastify.css'
toast.configure({ autoClose: 2000 })

// List of products
const Index = async (query, header) => {
    try {
        const response = await Axios.get(`${api}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Store product
/* const Store = async (data, header) => {
    try {
        const response = await Axios.post(`${api}`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error);
    }
} */



const Product = {
    Index,
    /* Store, */
}

export default Product