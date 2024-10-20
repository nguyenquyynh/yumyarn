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
        return { status: false, data: 'Opps ! Have a problem' };
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
        return { status: false, data: 'Opps ! Have a problem' };
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
        return { status: false, data: 'Opps ! Have a problem' };
    }
}
const getFollowing = async (user) => {
    try {
        const result = await AxiosInstance().get(`${Model.FOLLOWS}/${FOLLOW.GETFOLLOWING}?user=${user}`);
        if (result.status) {
            return { status: true, data: result.data };
        } else {
            return { status: false, data: result.data };
        }
    } catch (error) {
        console.log(error + "Lỗi getFollowing")
        return Promise.reject(error)
    }
}
const getFollowers = async (user) => {
    try {
        const result = await AxiosInstance().get(`${Model.FOLLOWS}/${FOLLOW.GETFOLLOWERS}?user=${user}`);
        if (result.status) {
            return { status: true, data: result.data };
        } else {
            return { status: false, data: result.data };
        }
    } catch (error) {
        console.log(error + "Lỗi getFollowers")
        return Promise.reject(error)
    }
}

export { createFollow, checkFollowerProfile, unFollow, getFollowing, getFollowers }