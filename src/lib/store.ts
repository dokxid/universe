import {configureStore} from '@reduxjs/toolkit'
import {addStoryDialog} from './features/dialogue/addStoryDialog'
import {map} from './features/map/map'
import {experiences} from "@/lib/features/experiences/experiences";
import {listExperiencesDialog} from "@/lib/features/dialogue/listExperiencesDialog";

export const makeStore = () => {
    return configureStore({
        reducer: {
            addStoryDialog: addStoryDialog.reducer,
            listExperiencesDialog: listExperiencesDialog.reducer,
            map: map.reducer,
            experiences: experiences.reducer,
        },
        devTools: true,
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']