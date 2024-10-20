import AxiosInstance from "services/AxiosInstance"
import { COMMENT, Model } from "./Model"

export async function getListComment(dataComment) {
    try {
        const resault = await AxiosInstance().get(`${Model.COMMENTS}/${COMMENT.GET}?id_post=${dataComment.id}&startingPoint=${dataComment.startingPoint}`)
        if (resault.status) {
            return { status: true, data : resault.data }
        } else {
            return { status: false, data : resault.data }
        }
    } catch (error) {
        return { status: false, data: 'Opps ! Have a problem' };
    }
}

export async function createComment(body) {
    try {
        const resault = await AxiosInstance().post(`${Model.COMMENTS}/${COMMENT.CREATE}`,body)
        if (resault.status) {
            return { status: true, data : resault.data }
        } else {
            return { status: false, data : resault.data }
        }
    } catch (error) {
        return { status: false, data: 'Opps ! Have a problem' };
    }
}

export async function getReComment(dataComment) {
    try {
        const resault = await AxiosInstance().get(`${Model.COMMENTS}/${COMMENT.GET_RECOMMENT}?parent=${dataComment.parent}&startingPoint=${dataComment.startingPoint}`)
        if (resault.status) {
            return { status: true, data : resault.data }
        } else {
            return { status: false, data : resault.data }
        }
    } catch (error) {
        return Promise.reject(error)
    }
}