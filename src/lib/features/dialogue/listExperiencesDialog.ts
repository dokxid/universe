import {createSlice} from "@reduxjs/toolkit";
import {DialogState} from "@/types/dialog";

const initialState: DialogState = {
    open: false,
}

export const listExperiencesDialog = createSlice({
    name: 'listExperiencesDialog',
    initialState,
    reducers: {
        setListExperienceDialogOpen: (state) => {
            state.open = !state.open;
        }
    }
})

export const {setListExperienceDialogOpen} = listExperiencesDialog.actions
export default listExperiencesDialog.reducer
