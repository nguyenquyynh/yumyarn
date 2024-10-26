import AxiosInstance from "services/AxiosInstance"
import { Model, POST, SUGGEST, USERS } from "./Model"
import { removeSpecialCharacters } from "src/libs/InputValidate"

const get_suggest = async (keyword) => {
    try {
        const resault = await AxiosInstance().get(`${Model.POSTS}/${SUGGEST.SUGGEST}?q=${keyword}`, null)
        return resault
    } catch (error) {
        console.log(error)
        return error
    }
}

const search_post = async (keyword, page) => {
    try {
        const resault = await AxiosInstance().get(`${Model.POSTS}/${POST.SEARCH}?q=${keyword}&page=${page}`, null)
        console.log("search_post", resault);
        return resault
    } catch (error) {
        console.log(error)
        return error
    }
}

const search_user = async (keyword, page, user) => {
    try {
        const resault = await AxiosInstance().get(`${Model.USERS}/${USERS.SEARCH}?q=${keyword}&page=${page}&user=${user}`, null)
        console.log("search_user", resault);
        return resault
    } catch (error) {
        console.log(error)
        return error
    }
}

export { get_suggest, search_post, search_user }