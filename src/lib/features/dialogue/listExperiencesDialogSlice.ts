import {createSlice} from "@reduxjs/toolkit";
import {DialogState} from "@/types/dialog";

const initialState: DialogState = {
    open: false,
}

export const listExperiencesDialogSlice = createSlice({
    name: 'listExperiencesDialog',
    initialState,
    reducers: {
        setListExperienceDialogOpen: (state) => {
            state.open = !state.open;
        }
    }
})

export const {setListExperienceDialogOpen} = listExperiencesDialogSlice.actions
export default listExperiencesDialogSlice.reducer
