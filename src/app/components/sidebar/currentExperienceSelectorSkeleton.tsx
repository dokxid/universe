import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {ChevronsUpDownIcon} from "lucide-react";
import React from "react";

export function CurrentExperienceSelectorSkeleton() {

    return (
        <Button
            variant={"outline"}
            disabled={true}
            role={"combobox"}
            className={
                "w-full justify-between min-h-20 max-h20 bg-primary text-primary-foreground"
            }
        >
            <div className={"flex flex-col text-left w-full text-wrap gap-2"}>
                <p className={"text-xs"}>Current experience:</p>
                <Skeleton className={"h-2 w-1/3"}/>
                <Skeleton className={"h-2 w-1/2"}/>
            </div>
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
        </Button>
    )
}
