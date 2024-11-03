import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    listPost:[]
}

export const home = createSlice({
    name: 'setting',
    initialState: INITIAL_STATE,
    reducers: {
        resetListPost: (state)=>{
            return {
                ...state,
                listPost : []
            }
        },
        setListPost: (state, action) => {
            return {
                ...state,
                listPost: [...state.listPost,...action.payload]
            }
        },
        updateFullListPost:(state,action)=>{    
            return {
                ...state,
                listPost: action.payload
            }
        }
    },
})

// Action creators are generated for each case reducer function
export const { setListPost, resetListPost, updateFullListPost} = home.actions

export default home.reducer