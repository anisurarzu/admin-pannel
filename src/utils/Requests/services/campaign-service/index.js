import Axios from 'axios'
import { CampaignService } from '../../../api'


// Index of items
const Index = async (query) => {
    const header = {
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    }

    return await Axios.get(`${CampaignService}campaign?${query}`, header)
}

// Store item
const Store = async (data) => {
    const header = {
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    }

    return await Axios.post(`${CampaignService}campaign`, data, header)
}

// Show specific item
const Show = async (id) => {
    const header = {
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    }

    return await Axios.get(`${CampaignService}campaign/${id}`, header)
}

// Update specific item
const Update = async (id, data) => {
    const header = {
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    }

    return await Axios.put(`${CampaignService}campaign/${id}`, data, header)
}

// Delete specific item
const Delete = async (id) => {
    const header = {
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    }

    return await Axios.delete(`${CampaignService}campaign/${id}`, header)
}

// Edit specific item banner
const EditBanner = async (id, data) => {
    const header = {
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    }

    return await Axios.put(`${CampaignService}campaign/edit-banner/${id}`, data, header)
}

// Search items
const Search = async (data) => {
    const header = {
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    }

    const queryString = Object.keys(data).map(key => `${key}=${data[key]}`).join('&')
    return await Axios.get(`${CampaignService}campaign?${queryString}`, header)
}


export const Campaign = {
    Index,
    Store,
    Show,
    Update,
    Delete,
    EditBanner,
    Search
}