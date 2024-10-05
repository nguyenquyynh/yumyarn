import {createSlice} from '@reduxjs/toolkit';
import {signOutGoogle} from 'services/Google';

const INITIAL_STATE = {
  fcmtoken: null,
  socket: undefined,
};

export const fcm = createSlice({
  name: 'fcm',
  initialState: INITIAL_STATE,
  reducers: {
    addSocket: (state, action) => {
      state.socket = action.payload
    },
    addfcmtoken: (state, action) => {
      state.fcmtoken = action.payload
    },
  },
});

export const {addSocket, addfcmtoken} = fcm.actions;

export default fcm.reducer;
