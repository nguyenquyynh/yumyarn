
import AxiosInstance from 'services/AxiosInstance'
import { Model, POST } from './Model'

export async function createpost(data) {
    try {
        const resault = await AxiosInstance().post(`${Model.POSTS}/${POST.CREATEPOST}`, data)
    
        if (resault.status) {
            return { status: true, data : resault.data }
        } else {
            return { status: false, data : resault.data }
        }
        
    } catch (error) {
        console.log(error+ "Lỗi")
        return Promise.reject(error)
    }

}

export async function getPost(dataRequest) {
    try {
        const resault = await AxiosInstance().get(`${Model.POSTS}/${POST.FEED}?create_by=${dataRequest.id}&page=${dataRequest.page}`)

        if (resault.status) {
            return { status: true, data : resault.data }
        } else {
            return { status: false, data : resault.data }
        }
        
    } catch (error) {
        console.log(error+ "Lỗi")
        return Promise.reject(error)
    }
}