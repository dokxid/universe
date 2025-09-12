import {configureStore} from '@reduxjs/toolkit'
import {addStoryDialogue} from './features/dialogue/addStoryDialogue'
import {map} from './features/map/map'

export const makeStore = () => {
    return configureStore({
        reducer: {addStoryDialogue: addStoryDialogue.reducer, map: map.reducer},
        devTools: true,
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']