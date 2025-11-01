import { createSlice } from "@reduxjs/toolkit";

const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

export const MAP_TILES = {
    "Alidade Smooth Dark":
        "https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json",
    "Alidade Smooth": "https://tiles.stadiamaps.com/styles/alidade_smooth.json",
    "Stamen Toner": "https://tiles.stadiamaps.com/styles/stamen_toner.json",
    "Stamen Watercolor":
        "https://tiles.stadiamaps.com/styles/stamen_watercolor.json",
    "Stamen Terrain": "https://tiles.stadiamaps.com/styles/stamen_terrain.json",
};

export interface SettingsState {
    mapTiles: keyof typeof MAP_TILES;
    descriptorOpen: boolean;
    exploreOpen: boolean;
    globeView: boolean;
    markerProjection?: "viewport" | "map";
    debug?: boolean;
}

const initialState: SettingsState = {
    mapTiles: "Alidade Smooth",
    descriptorOpen: true,
    exploreOpen: isMobile ? false : true,
    globeView: false,
    markerProjection: "viewport",
    debug: false,
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
        setExploreOpen: (state, action) => {
            state.exploreOpen = action.payload;
        },
        setGlobeView: (state, action) => {
            state.globeView = action.payload;
        },
        setMarkerProjection: (state, action) => {
            state.markerProjection = action.payload;
        },
        setDebug: (state, action) => {
            state.debug = action.payload;
        },
    },
});

export const {
    setMapTiles,
    setDescriptorOpen,
    setExploreOpen,
    setGlobeView,
    setMarkerProjection,
    setDebug,
} = settingsSlice.actions;
export default settingsSlice.reducer;
