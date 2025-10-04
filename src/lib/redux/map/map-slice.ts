import { createSlice } from "@reduxjs/toolkit";

export interface MapState {
    flyPosition: [number, number];
    zoomLevel: number;
    tags: string[];
    showConnections: boolean;
    selectedStoryId: string;
    zoomOut: boolean;
}

const initialState: MapState = {
    flyPosition: [24.750592, 59.44435],
    zoomLevel: 5,
    tags: [],
    showConnections: false,
    selectedStoryId: "",
    zoomOut: false,
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
        setTags: (state, action: { payload: string[] }) => {
            state.tags = action.payload;
        },
        setShowConnections: (state, action: { payload: boolean }) => {
            state.showConnections = action.payload;
        },
        setSelectedStoryId: (state, action: { payload: string }) => {
            console.log("Setting selected story ID to", action.payload);
            state.selectedStoryId = action.payload;
        },
        triggerZoomOut: (state) => {
            state.zoomOut = !state.zoomOut;
        },
    },
});

export const {
    setFlyPosition,
    setZoomLevel,
    decrementZoomLevel,
    setTags,
    setShowConnections,
    setSelectedStoryId,
    triggerZoomOut,
} = mapSlice.actions;
export default mapSlice.reducer;
