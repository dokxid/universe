import { CommandItem } from "@/components/ui/command";
import { setCurrentExperience } from "@/lib/features/experiences/experiencesSlice";
import { setFlyPosition, setZoomLevel } from "@/lib/features/map/mapSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { ExperienceData } from "@/types/api";
import { CheckIcon } from "lucide-react";

export function ExperiencesList({
    setOpen,
    experiences,
}: {
    setOpen: (open: boolean) => void;
    experiences: ExperienceData[];
}) {
    const dispatch = useAppDispatch();
    const experiencesState = useAppSelector((state) => state.experiences);
    return experiences.map((exp: ExperienceData, index: number) => (
        <CommandItem
            key={index}
            value={exp.slug}
            onSelect={(selectedValue) => {
                if (selectedValue == experiencesState.currentExperience) {
                    return;
                }
                dispatch(setCurrentExperience(selectedValue));
                setOpen(false);
                dispatch(setFlyPosition(exp.center.coordinates));
                dispatch(setZoomLevel(exp.initial_zoom));
            }}
        >
            <CheckIcon
                className={cn(
                    "mr-2 h-4 w-4",
                    experiencesState.currentExperience === exp.slug
                        ? "opacity-100"
                        : "opacity-0"
                )}
            />
            {exp.title}
        </CommandItem>
    ));
}
