import { createSlice } from "@reduxjs/toolkit";

export interface NavigationState {
    rightSideBarOpen?: boolean;
}

const initialState: NavigationState = {
    rightSideBarOpen: false,
};

export const navigationSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        setRightSideBarOpen: (state, action) => {
            state.rightSideBarOpen = action.payload;
        },
    },
});

export const { setRightSideBarOpen } = navigationSlice.actions;
export default navigationSlice.reducer;
