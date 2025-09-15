import {configureStore} from '@reduxjs/toolkit'
import {addStoryDialogSlice} from './features/dialogue/addStoryDialogSlice'
import {mapSlice} from './features/map/mapSlice'
import {experiencesSlice} from "@/lib/features/experiences/experiencesSlice";
import {listExperiencesDialogSlice} from "@/lib/features/dialogue/listExperiencesDialogSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            addStoryDialog: addStoryDialogSlice.reducer,
            listExperiencesDialog: listExperiencesDialogSlice.reducer,
            map: mapSlice.reducer,
            experiences: experiencesSlice.reducer,
        },
        devTools: true,
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']