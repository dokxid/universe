import { createSlice } from "@reduxjs/toolkit";

export interface LabState {
    currentLab: string;
}

const initialState: LabState = {
    currentLab: "universe",
};

export const labSlice = createSlice({
    name: "labs",
    initialState,
    reducers: {
        setCurrentLab: (state, action) => {
            state.currentLab = action.payload;
        },
    },
});

export const { setCurrentLab } = labSlice.actions;
export default labSlice.reducer;
