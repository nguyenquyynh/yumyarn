import { loginGoogle, signOutGoogle } from 'services/Google'

export async function userLogin() {
    const token = await loginGoogle()
    return token
}