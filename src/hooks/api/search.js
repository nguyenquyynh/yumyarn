import AxiosInstance from "services/AxiosInstance"
import { Model, POST, SUGGEST, USERS } from "./Model"

const add_search = async (keyword) => {
    try {
        const resault = await AxiosInstance().get(`${Model.SUGGEST}/${SUGGEST.ADD}?q=${keyword}`, null)

        if (resault.status) {

            return { status: true, data: resault.data }
        } else {
            return { status: false, data: resault.data }
        }

    } catch (error) {
        console.log(error + "Lỗi")
        return Promise.reject(error)
    }
}

const get_suggest = async (keyword) => {
    try {
        const resault = await AxiosInstance().get(`${Model.SUGGEST}/${SUGGEST.SUGGEST}?q=${keyword}`, null)
        if (resault.status) {
            return { status: true, data: resault.data }
        } else {
            return { status: false, data: resault.data }
        }

    } catch (error) {
        console.log(error + "Lỗi")
        return Promise.reject(error)
    }
}

const search_post = async (keyword, page) => {
    try {
        const resault = await AxiosInstance().get(`${Model.POSTS}/${POST.SEARCH}?q=${keyword}&page=${page}`, null)
        if (resault.status) {
            return { status: true, data: resault.data }
        } else {
            return { status: false, data: resault.data }
        }

    } catch (error) {
        console.log(error + "Lỗi")
        return Promise.reject(error)
    }
}

const search_user = async (keyword, page, user) => {
    try {
        const resault = await AxiosInstance().get(`${Model.USERS}/${USERS.SEARCH}?q=${keyword}&page=${page}&user=${user}`, null)
        if (resault.status) {
            return { status: true, data: resault.data }
        } else {
            return { status: false, data: resault.data }
        }

    } catch (error) {
        console.log(error + "Lỗi")
        return Promise.reject(error)
    }
}

export { add_search, get_suggest, search_post, search_user }