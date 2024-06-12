const { default: AxiosInstance } = require("services/AxiosInstance")
import { loginGoogle, signOutGoogle } from 'services/Google'
import { Model, USERS, USERS_AUTHEN } from './Model'
import { t } from 'lang'

export async function userLogin() {
    try {
        const token = await loginGoogle()
        const body = {
            name: token.user.name,
            email: token.user.email,
            avatar: token.user.photo
        }
        console.log(body)
        const resault = await AxiosInstance().post(`${Model.USERS}/${USERS.AUTHEN}`, body)
        if (resault.status) {
            if (resault.data.value === USERS_AUTHEN.REGISTER) {
                return { status: false, data : t("login.register")}
            }
            if (resault.data.value === USERS_AUTHEN.LOGIN) {
                return { status: true, data : resault.data.data }
            }
            if (resault.data.value === USERS_AUTHEN.VERIFY) {
                return { status: false, data :  t("login.verify") }
            }
        } else {
            return { status: false, data : resault.data.data }
        }
        
    } catch (error) {
        return Promise.reject(error)
    }

}