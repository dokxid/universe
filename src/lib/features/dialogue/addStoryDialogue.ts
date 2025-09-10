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
        toggleOpen: (state, action) => {
            state.open = action.payload
        }
    }
})

export const { toggleOpen } = addStoryDialogue.actions
export default addStoryDialogue.reducer