import { CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { LabDTO } from "@/types/dtos";
import { CheckIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function LabsList({
    setOpen,
    labs,
    currentLab,
}: {
    setOpen: (open: boolean) => void;
    labs: LabDTO[];
    currentLab: LabDTO;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get a new searchParams string by merging the current
    // searchParams with a provided key/value pair
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    return labs.map((lab: LabDTO, index: number) => (
        <CommandItem
            key={index}
            value={lab.slug}
            onSelect={(selectedValue) => {
                router.push(
                    pathname + "?" + createQueryString("exp", selectedValue)
                );
                setOpen(false);
            }}
        >
            <CheckIcon
                className={cn(
                    "mr-2 h-4 w-4",
                    currentLab.slug === lab.slug ? "opacity-100" : "opacity-0"
                )}
            />
            {lab.name}
        </CommandItem>
    ));
}
