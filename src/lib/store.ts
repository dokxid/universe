import { experiencesSlice } from "@/lib/features/experiences/experiencesSlice";
import { settingsSlice } from "@/lib/features/settings/settingsSlice";
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
import { addStoryDialogSlice } from "./features/dialogue/addStoryDialogSlice";
import { mapSlice } from "./features/map/mapSlice";

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
        addStoryDialog: addStoryDialogSlice.reducer,
        map: mapSlice.reducer,
        experiences: experiencesSlice.reducer,
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
