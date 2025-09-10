import {createSlice} from "@reduxjs/toolkit";

// TODO: reformat to new file
export interface DialogueState {
    open: boolean;
}

const initialState: DialogueState = {
    open: false,
}

export const addStoryDialogue = createSlice({
    name: 'addStoryDialogue',
    initialState,
    reducers: {
        setOpen: (state) => {
            state.open = !state.open;
        }
    }
})

export const { setOpen } = addStoryDialogue.actions
export default addStoryDialogue.reducer