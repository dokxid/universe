import {createSlice} from "@reduxjs/toolkit";
import {DialogState} from "@/types/dialog";

const initialState: DialogState = {
    open: false,
}

export const addStoryDialog = createSlice({
    name: 'addStoryDialog',
    initialState,
    reducers: {
        setAddStoryDialogOpen: (state) => {
            state.open = !state.open;
        }
    }
})

export const {setAddStoryDialogOpen} = addStoryDialog.actions
export default addStoryDialog.reducer