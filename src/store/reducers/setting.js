import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    theme: 'light',
    language: 'vi',
    rollpost: true
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
        },
        setting_roll: (state, action) => {
            console.log(action);
            
            return {
                ...state,
                rollpost: action.payload
            }
        }
    },
})

// Action creators are generated for each case reducer function
export const { setting_resetlanguage, setting_changelanguage, setting_roll } = setting.actions

export default setting.reducer