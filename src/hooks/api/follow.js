import AxiosInstance from "services/AxiosInstance"
import { FOLLOW, Model } from "./Model"


const createFollow = async (u, f) => {
    try {
        const body = {
            user: u,
            follower: f
        }
        const resault = await AxiosInstance().post(`${Model.FOLLOWS}/${FOLLOW.FOLLOW}`, body)
        return resault
    } catch (error) {
        console.log(error + "Lỗi")
        return { status: false }
    }
}

const checkFollowerProfile = async (body) => {
    try {
        const result = await AxiosInstance().post(`${Model.FOLLOWS}/${FOLLOW.CHECKFOLLOWER}`, body)
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

const unFollow = async (body) => {
    try {
        const result = await AxiosInstance().delete(`${Model.FOLLOWS}/${FOLLOW.UNFOLLOW}`, {
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


export { createFollow, checkFollowerProfile, unFollow }