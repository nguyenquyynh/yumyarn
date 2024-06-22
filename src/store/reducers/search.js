import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    history: []
}

export const search = createSlice({
    name: 'search',
    initialState: INITIAL_STATE,
    reducers: {
        history_removeall: () => {
            return INITIAL_STATE
        },
        history_addsearch: (state, action) => {
            return {
                ...state,
                history : [...state.history.filter(el => el != action.payload), action.payload]
            }
        },
        history_remaove: (state, action) => {
            return {
                ...state,
                history: [...state.history.filter(el => el != action.payload)]
            }
        }
    },
})

// Action creators are generated for each case reducer function
export const { history_removeall, history_addsearch, history_remaove } = search.actions

export default search.reducer