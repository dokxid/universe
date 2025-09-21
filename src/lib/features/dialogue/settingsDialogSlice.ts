import {createSlice} from "@reduxjs/toolkit";
import {DialogState} from "@/types/dialog";

const initialState: DialogState = {
    open: false,
}

export const settingsDialogSlice = createSlice({
    name: 'settingsDialog',
    initialState,
    reducers: {
        setSettingsDialogOpen: (state) => {
            state.open = !state.open;
        }
    }
})

export const {setSettingsDialogOpen} = settingsDialogSlice.actions
export default settingsDialogSlice.reducer
