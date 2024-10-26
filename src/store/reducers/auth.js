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
            return { ...state, ...action.payload }
        },
        auth_check: (state, action) => {
            return { ...state, ...action.payload }
        },
        changeAvatarRedux: (state, action) => {
            state.user.avatar = action.payload //avatar
        },
        changeCoverPhotoRedux: (state, action) => {
            state.user.coverPhoto = action.payload //CoverPhoto
        },
        deleteStory: (state) => {
            return { ...state, user: { ...state.user, story: '' } }
        },
        udpateMessageProfile: (state, action) => {
            state.user.message_recive_status = action.payload.message_recive_status
            state.user.message_active_status = action.payload.message_active_status
            state.user.message_reading_status = action.payload.message_reading_status
        },
        updateInforRedux: (state, action) => {
            return {
                ...state,
                user: {
                    ...state.user,
                    tagName: action.payload.tagName,
                    name: action.payload.name,
                    story: action.payload.story,
                }
            }
        }
    },
})

export const { updateInforRedux,deleteStory, auth_logout, auth_login, auth_check, changeAvatarRedux, changeCoverPhotoRedux , udpateMessageProfile} = auth.actions

export default auth.reducer