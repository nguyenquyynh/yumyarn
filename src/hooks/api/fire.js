import AxiosInstance from "services/AxiosInstance"
import { FIRE, Model } from "./Model"



const firePost = async (user, post) => {
    try {
        const body = {
            u: user,
            p: post
        }
        const response = await AxiosInstance().post(`${Model.FIRES}/${FIRE.CREATE}`, body)
        return response
    } catch (error) {
        console.log(error + " Lỗi")
        return { status: false }
    }
}

export { firePost }