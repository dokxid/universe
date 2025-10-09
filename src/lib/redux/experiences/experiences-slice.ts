import { createSlice } from "@reduxjs/toolkit";

// TODO: reformat to new file
export interface experiencesState {
    currentExperience: string;
}

const initialState: experiencesState = {
    currentExperience: "universe",
};

export const experiencesSlice = createSlice({
    name: "experiences",
    initialState,
    reducers: {
        setCurrentExperience: (state, action) => {
            state.currentExperience = action.payload;
        },
    },
});

export const { setCurrentExperience } = experiencesSlice.actions;
export default experiencesSlice.reducer;
