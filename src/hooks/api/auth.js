const { default: AxiosInstance } = require("services/AxiosInstance")
import { loginGoogle, signOutGoogle } from 'services/Google'
import { Model, USERS, USERS_AUTHEN } from './Model'
import { t } from 'lang'

export async function userLogin(fcmtoken) {
    try {
        const token = await loginGoogle()
        const body = {
            name: token.user.name,
            email: token.user.email,
            avatar: token.user.photo,
            fcm_token: fcmtoken
        }
        const resault = await AxiosInstance().post(`${Model.USERS}/${USERS.AUTHEN}`, body)
        if (resault.status) {
            if (resault.data.value === USERS_AUTHEN.REGISTER) {
                return { status: false, data: t("login.register") }
            }
            if (resault.data.value === USERS_AUTHEN.LOGIN) {
                return { status: true, data: resault.data }
            }
            if (resault.data.value === USERS_AUTHEN.VERIFY) {
                return { status: false, data: t("login.verify") }
            }
            if (resault.data.value === 'BLOCK') {
                return { status: false, data: 'You account was block !!' }
            }
        } else {
            return { status: false, data: resault.data.data }
        }

    } catch (error) {
        return { status: false, data: 'Opps ! Have a problem' };
    }

}
export async function checkAuthen(token) {
    try {
        if (!token) {
            return false
        }
        const resault = await AxiosInstance().get(`${Model.USERS}/${USERS.CHECKAUTHEN}?token=${token}`);
        return resault.status
    } catch (error) {
        return false
    }

}

export function isTokenExpired(statuscode) {
    if (statuscode !== 401) {
        console.log("Token còn hạn");
        return true
    } else
        console.log("Token đã hết hạn vui lòng đăng nhập lại");
    return false

}