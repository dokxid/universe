import { createSlice } from "@reduxjs/toolkit";

export interface NavigationState {
    rightSideBarOpen?: boolean;
    storyDetailsOpen?: boolean;
}

const initialState: NavigationState = {
    rightSideBarOpen: false,
    storyDetailsOpen: false,
};

export const navigationSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        setRightSideBarOpen: (state, action) => {
            state.rightSideBarOpen = action.payload;
        },
        setStoryDetailsOpen: (state) => {
            state.storyDetailsOpen = !state.storyDetailsOpen;
        },
    },
});

export const { setRightSideBarOpen, setStoryDetailsOpen } =
    navigationSlice.actions;
export default navigationSlice.reducer;
