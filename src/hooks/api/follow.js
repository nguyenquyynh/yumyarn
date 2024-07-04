import AxiosInstance from "services/AxiosInstance"
import { FOLLOW, Model } from "./Model"


const checkFollow = async (user, follower) => {
    try {
        body = {
            user: user,
            follower: follower
        }
        const resault = await AxiosInstance().post(`${Model.FOLLOWS}/${FOLLOW.CHECK}`, body)
        return resault
    } catch (error) {
        console.log(error + "Lỗi")
        return Promise.reject(error)
    }
}

export { checkFollow }