import { createSlice } from "@reduxjs/toolkit";

export const MAP_TILES = {
    "Alidade Smooth Dark":
        "https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json",
    "Alidade Smooth": "https://tiles.stadiamaps.com/styles/alidade_smooth.json",
    "Stamen Toner": "https://tiles.stadiamaps.com/styles/stamen_toner.json",
    "Stamen Watercolor":
        "https://tiles.stadiamaps.com/styles/stamen_watercolor.json",
};

export interface SettingsState {
    mapTiles: keyof typeof MAP_TILES;
    descriptorOpen: boolean;
    globeView: boolean;
    markerProjection?: "viewport" | "map";
}

const initialState: SettingsState = {
    mapTiles: "Alidade Smooth",
    descriptorOpen: true,
    globeView: false,
    markerProjection: "viewport",
};

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setMapTiles: (state, action) => {
            state.mapTiles = action.payload;
        },
        setDescriptorOpen: (state, action) => {
            state.descriptorOpen = action.payload;
        },
        setGlobeView: (state, action) => {
            state.globeView = action.payload;
        },
        setMarkerProjection: (state, action) => {
            state.markerProjection = action.payload;
        },
    },
});

export const {
    setMapTiles,
    setDescriptorOpen,
    setGlobeView,
    setMarkerProjection,
} = settingsSlice.actions;
export default settingsSlice.reducer;
