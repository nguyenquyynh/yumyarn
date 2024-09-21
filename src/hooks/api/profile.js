import AxiosInstance from "services/AxiosInstance"
import { Model, POST, SUGGEST, USERS, PROFILE } from "./Model"

const checkFollowerProfile = async (body) => {
    try {
        const result = await AxiosInstance().post(`${Model.FOLLOWS}/${PROFILE.CHECKFOLLOWER}`, body)
        if (result.status) {
            return { status: true, data: result.data }
        } else {
            return { status: false, data: result.data }
        }
    } catch (error) {
        console.log(error + "Lỗi")
        return Promise.reject(error)
    }
}
const countFollower = async (_id) => {
    try {
        const result = await AxiosInstance().post(`${Model.USERS}/${PROFILE.COUNTFOLLOWER}?_id=${_id}`,)
        if (result.status) {
            return { status: true, data: result.data }
        } else {
            return { status: false, data: result.data }
        }
    } catch (error) {
        console.log(error + "Lỗi")
        return Promise.reject(error)
    }
}
const follower = async (body) => {
    try {
        const result = await AxiosInstance().post(`${Model.FOLLOWS}/${PROFILE.FOLLOWER}`, body)
        if (result.status) {
            return { status: true, data: result.data }
        } else {
            return { status: false, data: result.data }
        }
    } catch (error) {
        console.log(error + "Lỗi")
        return Promise.reject(error)
    }
}
const unFollower = async (body) => {
    try {
        const result = await AxiosInstance().delete(`${Model.FOLLOWS}/${PROFILE.UNFOLLOW}`, {
            data: body
        });
        if (result.status) {
            return { status: true, data: result.data };
        } else {
            return { status: false, data: result.data };
        }
    } catch (error) {
        console.log(error + "Lỗi unFollower")
        return Promise.reject(error)
    }
}
const getTimeline = async (body) => {
    try {
        const result = await AxiosInstance().get(`${Model.POSTS}/${POST.TIMELINE}?u=${body.user}&page=${body.page}`)
        if (result.status) {
            return { status: true, data: result.data };
        } else {
            return { status: false, data: result.data };
        }
    } catch (error) {
        console.log(error + "Lỗi getPost")
        return Promise.reject(error)
    }
}

export { checkFollowerProfile, countFollower, follower, unFollower, getTimeline }