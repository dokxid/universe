import {AddStoryDialog} from "@/components/dialog/addStoryDialog";
import {setAddStoryDialogOpen} from "@/lib/features/dialogue/addStoryDialogSlice";
import {ListExperiencesDialog} from "@/components/dialog/listExperiencesDialog";
import {setListExperienceDialogOpen} from "@/lib/features/dialogue/listExperiencesDialogSlice";
import {SettingsDialog} from "@/components/dialog/settingsDialog";
import {setSettingsDialogOpen} from "@/lib/features/dialogue/settingsDialogSlice";
import React from "react";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";

export function DialogProvider() {
    const dispatch = useAppDispatch()
    const addStoryDialogue = useAppSelector(state => state.addStoryDialog)
    const listExperiencesDialog = useAppSelector(state => state.listExperiencesDialog)
    const settingsDialog = useAppSelector(state => state.settingsDialog)
    return (
        <>
            <AddStoryDialog
                isOpen={addStoryDialogue.open}
                onOpenChange={() => dispatch(setAddStoryDialogOpen())}
            />
            <ListExperiencesDialog
                isOpen={listExperiencesDialog.open}
                onOpenChange={() => dispatch(setListExperienceDialogOpen())}
            />
            <SettingsDialog
                isOpen={settingsDialog.open}
                onOpenChange={() => dispatch(setSettingsDialogOpen())}
            />
        </>
    )
}