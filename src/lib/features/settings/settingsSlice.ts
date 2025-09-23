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
    mapTiles: string;
}

const initialState: SettingsState = {
    mapTiles: MAP_TILES["Alidade Smooth"],
};

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setMapTiles: (state, action) => {
            state.mapTiles = action.payload;
        },
    },
});

export const { setMapTiles } = settingsSlice.actions;
export default settingsSlice.reducer;
