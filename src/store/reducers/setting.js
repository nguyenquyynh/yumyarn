import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    theme: 'light',
    language: 'vi'
}

export const setting = createSlice({
    name: 'setting',
    initialState: INITIAL_STATE,
    reducers: {
        setting_resetlanguage: () => {
            return INITIAL_STATE
        },
        setting_changelanguage: (state, action) => {
            return {
                ...state,
                language: action.payload
            }
        }
    },
})

// Action creators are generated for each case reducer function
export const { setting_resetlanguage, setting_changelanguage } = setting.actions

export default setting.reducer