import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DialogState} from "@/types/dialog";

interface AddStoryDialogState extends DialogState {
    longitude: number,
    latitude: number,
}

const initialState: AddStoryDialogState = {
    open: false,
    longitude: 0,
    latitude: 0,
}

export const addStoryDialog = createSlice({
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

export const {setAddStoryDialogOpen, setLngLat} = addStoryDialog.actions
export default addStoryDialog.reducer