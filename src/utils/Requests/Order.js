import Axios from 'axios'
import { api, orderProcessApi } from '../api'
import { toast } from 'react-toastify'
import { errorHandeller } from './Error'
import 'react-toastify/dist/ReactToastify.css'
toast.configure({ autoClose: 2000 })

// List of orders
const Index = async (query, header) => {
    try {
        const response = await Axios.get(`${api}order?${query}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Show specific order
const Show = async (id, header) => {
    try {
        const response = await Axios.get(`${api}order/${id}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Store order
const Store = async (data, header) => {
    try {
        const response = await Axios.post(`${api}order`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update specific order status
const Update = async (id, data, header) => {
    try {
        const response = await Axios.get(`${api}order/${id}/${data}`, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update specific order payment status
const UpdatePaymentStatus = async (id, data, header) => {
    try {
        const response = await Axios.put(`${api}order/payment/${id}`, { status: data }, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update specific order delivery address
const UpdateAddress = async (id, data, header) => {
    try {
        const response = await Axios.put(`${api}order/${id}`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Search an order
const Search = async (data, header) => {
    try {
        const response = await Axios.get(`${api}order/global/search/items?query=${data}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Filter date wise
const DateRangeFilter = async (data, header) => {
    try {
        const response = await Axios.post(`${api}order/filter-date-range`, data, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Send delivery info
const SendDeliveryInfo = async (data, header) => {
    try {
        const response = await Axios.post(`${api}order/send-delivery-info`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Item cancelation 
const ItemCancelation = async (data, header) => {
    try {
        const response = await Axios.post(`${api}order/cancel-item`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Search customer
const SearchCustomer = async (data, header) => {
    try {
        const response = await Axios.post(`${api}order/customer/search`, { query: data }, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Process order
const ProcessOrder = async (products, header) => {
    try {
        const response = await Axios.post(`${orderProcessApi}order/details`,  products , header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Apply Coupon
const ApplyCoupon = async (data, header) => {
    try {
        const response = await Axios.post(`${orderProcessApi}coupon/apply`, data, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Place order
const PlaceOrder = async (data, header) => {
    try {
        const response = await Axios.post(`${orderProcessApi}order/place`, data, header)
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
        const response = await Axios.get(`${api}order/search/delivery-address/${data}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Filter Orders
const FilterOrders = async (data, header) => {
    try {
        const response = await Axios.get(`${api}order/filter/${data.value}/${data.field}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Store comment
const StoreComment = async (data, header) => {
    try {
        const response = await Axios.post(`${api}order/comment`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Store comment
const GetCommentsByOrderId = async (id, header) => {
    try {
        const response = await Axios.get(`${api}order/comment/show/${id}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update specific order follow up status
const UpdateFollowUp = async (id, header) => {
    try {
        const response = await Axios.get(`${api}order/notification/follow-up/${id}`, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

const Order = {
    Index,
    Show,
    Store,
    Update,
    UpdatePaymentStatus,
    UpdateAddress,
    Search,
    DateRangeFilter,
    SendDeliveryInfo,
    ItemCancelation,
    SearchCustomer,
    ProcessOrder,
    ApplyCoupon,
    PlaceOrder,
    FilterItem,
    FilterOrders,
    StoreComment,
    GetCommentsByOrderId,
    UpdateFollowUp
}

export default Order