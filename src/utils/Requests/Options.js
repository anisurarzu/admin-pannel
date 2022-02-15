import Axios from 'axios'
import { api } from '../api'
import { toast } from 'react-toastify'
import { errorHandeller } from './Error'
import 'react-toastify/dist/ReactToastify.css'
toast.configure({ autoClose: 2000 })

// Index of items
const Index = async (header) => {
    try {
        const response = await Axios.get(`${api}options`, header)
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Category search
const Category = async (query, header) => {
    try {
        const response = await Axios.get(`${api}options/category/${query}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Sub-Category search
const SubCategory = async (query, header) => {
    try {
        const response = await Axios.get(`${api}options/sub-category/${query}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Leaf-Category search
const LeafCategory = async (query, header) => {
    try {
        const response = await Axios.get(`${api}options/leaf-category/${query}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Brand search
const Brand = async (query, header) => {
    try {
        const response = await Axios.get(`${api}options/brand/${query}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Vendor search
const Vendor = async (query, header) => {
    try {
        const response = await Axios.get(`${api}options/vendor/${query}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Customer search
const Customer = async (query, header) => {
    try {
        const response = await Axios.get(`${api}options/customer/${query}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Product search
const Product = async (query, header) => {
    try {
        const response = await Axios.get(`${api}options/product/${query}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

const Options = {
    Index,
    Category,
    SubCategory,
    LeafCategory,
    Brand,
    Vendor,
    Customer,
    Product
}

export default Options