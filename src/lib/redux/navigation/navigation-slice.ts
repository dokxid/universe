import { createSlice } from "@reduxjs/toolkit";


export interface NavigationState {
    storyDetailsOpen?: boolean;
}

const initialState: NavigationState = {
    storyDetailsOpen: true,
};

export const navigationSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        setStoryDetailsOpen: (state) => {
            state.storyDetailsOpen = !state.storyDetailsOpen;
        },
    },
});

export const { setStoryDetailsOpen } =
    navigationSlice.actions;
export default navigationSlice.reducer;
