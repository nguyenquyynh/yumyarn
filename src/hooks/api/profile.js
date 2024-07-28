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
const getIdUser = async (_id) => {
    try {
        const result = await AxiosInstance().post(`${Model.USERS}/${PROFILE.FINDUSER}?_id=${_id}`,)
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

const getPost = async (body) => {
    try {
        const result = await AxiosInstance().get(`${Model.POSTS}/${PROFILE.POST}?_id=${body._id}&page=${body.page}&limit=${body.limit}`,)
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

const changeAvatar = async (body) => {
    try {
        const result = await AxiosInstance().post(`${Model.USERS}/${PROFILE.AVATAR}`, body)
        if (result.status) {
            return { status: true };
        } else {
            return { status: false };
        }
    } catch (error) {
        console.log(error + "Lỗi changeAvatar")
        return Promise.reject(error)
    }
}

const changeCoverPhoto = async (body) => {
    try {
        const result = await AxiosInstance().post(`${Model.USERS}/${PROFILE.COVERPHOTO}`, body)
        if (result.status) {
            return { status: true };
        } else {
            return { status: false };
        }
    } catch (error) {
        console.log(error + "Lỗi changeCoverPhoto")
        return Promise.reject(error)
    }
}


export { changeCoverPhoto, changeAvatar, checkFollowerProfile, getIdUser, countFollower, follower, unFollower, getPost }