import Axios from 'axios'
import { api } from '../api'

// Filter report 
const Filter = async (query, header) => {
    const response = await Axios.get(`${api}report/vendor-purchase-order/filter?${query}`, header)
    return response
}

const Reports = { Filter }
export default Reports
