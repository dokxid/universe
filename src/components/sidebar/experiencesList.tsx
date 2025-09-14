import {useExperiences} from "@/lib/data_hooks/experiencesHook";
import {Spinner} from "../ui/shadcn-io/spinner";
import {ExperienceData} from "@/types/api";
import {CommandItem} from "@/components/ui/command";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {setCurrentExperience} from "@/lib/features/experiences/experiences";
import {setFlyPosition, setZoomLevel} from "@/lib/features/map/map";
import {CheckIcon} from "lucide-react";
import {cn} from "@/lib/utils";


export function ExperiencesList({setOpen}: { setOpen: (open: boolean) => void }) {
    const dispatch = useAppDispatch()
    const experiencesState = useAppSelector((state) => state.experiences)
    const {experiences, isLoading} = useExperiences()
    if (isLoading) return <Spinner/>
    return experiences.map((exp: ExperienceData) => (
        <CommandItem
            key={exp._id.toString()}
            value={exp.slug}
            onSelect={(selectedValue) => {
                if (selectedValue === experiencesState.currentExperience) {
                    return;
                }
                dispatch(setCurrentExperience(selectedValue))
                setOpen(false)
                dispatch(setFlyPosition(exp.center.coordinates))
                dispatch(setZoomLevel(exp.initial_zoom))
            }}
        >
            <CheckIcon
                className={cn(
                    "mr-2 h-4 w-4",
                    experiencesState.currentExperience === exp.slug ? "opacity-100" : "opacity-0"
                )}
            />
            {exp.title}
        </CommandItem>
    ))
}