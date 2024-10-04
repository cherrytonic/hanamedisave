/* eslint-disable */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: '',
  resident1:'',
  resident2:'',
  id: [],
  idenvc: '',
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userInfo: (state, action) => {
      state.name = action.payload.name;
      state.resident1 = action.payload.resident1;
      state.resident2 = action.payload.resident2;
    },
    certInfo: (state, action) => {
      const certList = state.cert;
      state.cert = [...certList, action.payload]
      console.log(action.payload);
      console.log(state.cert);
    },
    idInfo: (state, action) => {
      state.id = action.payload
      console.log(state.id);
    },
    idenVC: (state, action) => {
      state.idenvc = action.payload
      console.log(state.idenvc);
    },

  },
});

export const { userInfo, certInfo, idInfo, idenVC } = userSlice.actions;
export default userSlice;