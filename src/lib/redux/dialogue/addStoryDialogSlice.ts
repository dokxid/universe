import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AddStoryDialogState {
    open: boolean,
    longitude: number,
    latitude: number,
}

const initialState: AddStoryDialogState = {
    open: false,
    longitude: 0,
    latitude: 0,
}

export const addStoryDialogSlice = createSlice({
    name: 'addStoryDialog',
    initialState,
    reducers: {
        setAddStoryDialogOpen: (state) => {
            state.open = !state.open;
        },
        setLngLat: (state, action: PayloadAction<[number, number]>) => {
            state.longitude = action.payload[0];
            state.latitude = action.payload[1];
        },
    }
})

export const {setAddStoryDialogOpen, setLngLat} = addStoryDialogSlice.actions
export default addStoryDialogSlice.reducer