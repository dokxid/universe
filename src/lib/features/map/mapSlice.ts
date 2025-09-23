import { createSlice } from "@reduxjs/toolkit";

export interface MapState {
    flyPosition: [number, number];
    zoomLevel: number;
}

const initialState: MapState = {
    flyPosition: [24.750592, 59.44435],
    zoomLevel: 5,
};

export const mapSlice = createSlice({
    name: "map",
    initialState,
    reducers: {
        setFlyPosition: (state, action) => {
            state.flyPosition = action.payload;
        },
        setZoomLevel: (state, action) => {
            state.zoomLevel = action.payload;
        },
        decrementZoomLevel: (state) => {
            state.zoomLevel -= 1;
        },
    },
});

export const { setFlyPosition, setZoomLevel, decrementZoomLevel } =
    mapSlice.actions;
export default mapSlice.reducer;
