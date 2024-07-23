import AxiosInstance from "services/AxiosInstance"
import { FOLLOW, Model } from "./Model"


const createFollow = async (u, f) => {
    console.log("aaaaaaaa");
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

export { createFollow }