import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    user: {},
    isLogin: false,
}

export const auth = createSlice({
    name: 'auth',
    initialState: INITIAL_STATE,
    reducers: {
        auth_logout: () => {
            
            return INITIAL_STATE
        },
        auth_login: (state) => {

        }
    },
})

export const { auth_logout, auth_login } = auth.actions

export default auth.reducer