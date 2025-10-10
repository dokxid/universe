import { experiencesSlice } from "@/lib/redux/experiences/experiences-slice";
import { navigationSlice } from "@/lib/redux/navigation/navigation-slice";
import { settingsSlice } from "@/lib/redux/settings/settings-slice";
import { configureStore } from "@reduxjs/toolkit";
import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { addStorySlice } from "./redux/dialogue/add-story-slice";
import { mapSlice } from "./redux/map/map-slice";

const persistConfig = {
    key: "settings",
    storage,
    blacklist: ["descriptorOpen"], // don't persist descriptorOpen as it is a UI state
};

const persistedSettingsReducer = persistReducer(
    persistConfig,
    settingsSlice.reducer
);

export const store = configureStore({
    reducer: {
        settings: persistedSettingsReducer,
        addStoryDialog: addStorySlice.reducer,
        map: mapSlice.reducer,
        experiences: experiencesSlice.reducer,
        navigation: navigationSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
    devTools: true,
});

export const persistor = persistStore(store);

// Keep the makeStore function if you need it elsewhere
export const makeStore = () => store;

// Infer the type of store
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
