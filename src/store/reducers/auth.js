import { createSlice } from '@reduxjs/toolkit'
import { signOutGoogle } from 'services/Google'

const INITIAL_STATE = {
    user: {},
    token: null,
    isLogin: false
}

export const auth = createSlice({
    name: 'auth',
    initialState: INITIAL_STATE,
    reducers: {
        auth_logout: () => {
            signOutGoogle()
            return INITIAL_STATE
        },
        auth_login: (state, action) => {
            return {...state, ...action.payload}
        },
        auth_check: (state, action) => {
            return {...state, ...action.payload}
        }
    },
})

export const { auth_logout, auth_login, auth_check } = auth.actions

export default auth.reducer