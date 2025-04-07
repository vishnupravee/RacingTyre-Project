import { createSlice } from "@reduxjs/toolkit";
export const DataSlice = createSlice({
  name: "Data",
  initialState: {
    userDetail: {}

  },
  reducers: {

    setuserDetail: (state, action) => {
        state.userDetail = action.payload;
      }
     

  },
});

export const { setuserDetail} =DataSlice.actions;
export default DataSlice.reducer;