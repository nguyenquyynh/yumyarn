import AxiosInstance from "services/AxiosInstance"
import { FIRE, Model } from "./Model"



const firePost = async (user, post, fcm_token) => {
    try {
        const body = {
            u: user,
            p: post,
            // fcm_token: fcm_token
        }
        const response = await AxiosInstance().post(`${Model.FIRES}/${FIRE.CREATE}`, body)
        return response
    } catch (error) {
        console.log(error + " Lỗi")
        return { status: false, data: 'Opps ! Have a problem' };
    }
}

export { firePost }