import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getcategoryList, getEventList, getRacerList } from "../core/services/MasterApiServices";
import { getUserguid } from "../core/services/UserMasterApiServices";

// Thunks to fetch data
export const fetchracer = createAsyncThunk(
  "filters/fetchracer",
  async () => {
    const data = await getRacerList();
    return data;
  }
);

export const fetchcategory = createAsyncThunk(
  "filters/fetchcategory",
  async () => {
    const data = await getcategoryList();
    return data;
  }
);

export const fetchevents = createAsyncThunk(
  "filters/events",
  async () => {
    const data = await getEventList();
    return data;
  }
);
export const fetchuserlist = createAsyncThunk(
  "filters/userlist",
  async (guid) => {
    const data = await getUserguid(guid);
    return data;
  }
);

const fetchmaster = createSlice({
  name: "masters",
  initialState: {
    racerList: [],
    formatedracerList: [],
    formatedCategoryList: [],
    categoryList: [],
    eventList: [],
    userList:[],
    loading: false, // Add loading to initial state
    error: null, // Add error to initial state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch racers
      .addCase(fetchracer.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchracer.fulfilled, (state, action) => {
        state.racerList = action.payload.listRacerRegistration;
        state.formatedracerList = action.payload.listRacerRegistration?.map((e) => ({
          value: e.guid,
          label: e.fullName,
        }));
        state.loading = false;
      })
      .addCase(fetchracer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch racer list";
      })

      // Fetch categories
      .addCase(fetchcategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchcategory.fulfilled, (state, action) => {
        state.categoryList = action.payload.listCategory;
        state.formatedCategoryList = action.payload?.listCategory?.map((data) => ({
          value: data.guid,
          label: data.name,
        }));
        state.loading = false;
      })
      .addCase(fetchcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch category list";
      })

      // Fetch events
      .addCase(fetchevents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchevents.fulfilled, (state, action) => {
        state.eventList = action.payload.listEvents;
        state.loading = false;
      })
      .addCase(fetchevents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch events";
      })
      .addCase(fetchuserlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchuserlist.fulfilled, (state, action) => {
        state.userList = action.payload.listEvents;
        state.loading = false;
      })
      .addCase(fetchuserlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch events";
      });
  },
});

export default fetchmaster.reducer;
