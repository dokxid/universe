import { CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Experience } from "@/types/dtos";
import { CheckIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function ExperiencesList({
    setOpen,
    experiences,
    currentExperience,
}: {
    setOpen: (open: boolean) => void;
    experiences: Experience[];
    currentExperience: Experience;
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

    return experiences.map((exp: Experience, index: number) => (
        <CommandItem
            key={index}
            value={exp.slug}
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
                    currentExperience.slug === exp.slug
                        ? "opacity-100"
                        : "opacity-0"
                )}
            />
            {exp.title}
        </CommandItem>
    ));
}
