import {createSlice} from "@reduxjs/toolkit";

// TODO: reformat to new file
export interface experiencesState {
    currentExperience: string;
}

const initialState: experiencesState = {
    currentExperience: "universe",
}

export const experiences = createSlice({
    name: 'experiences',
    initialState,
    reducers: {
        setCurrentExperience: (state, action) => {
            state.currentExperience = action.payload;
        }
    }
})

export const {setCurrentExperience} = experiences.actions
export default experiences.reducer
