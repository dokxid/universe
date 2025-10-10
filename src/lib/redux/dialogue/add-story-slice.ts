import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AddStoryState {
    open: boolean;
    longitude: number;
    latitude: number;
}

const initialState: AddStoryState = {
    open: false,
    longitude: 0,
    latitude: 0,
};

export const addStorySlice = createSlice({
    name: "addStory",
    initialState,
    reducers: {
        setAddStoryDialogOpen: (state) => {
            state.open = !state.open;
        },
        setLngLat: (state, action: PayloadAction<[number, number]>) => {
            state.longitude = action.payload[0];
            state.latitude = action.payload[1];
        },
    },
});

export const { setAddStoryDialogOpen, setLngLat } = addStorySlice.actions;
export default addStorySlice.reducer;
