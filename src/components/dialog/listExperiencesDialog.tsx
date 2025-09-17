import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {Dispatch, SetStateAction} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useExperiences} from "@/lib/data_hooks/experiencesHook";
import Image from "next/image";
import {SquareArrowOutUpRight} from "lucide-react";

export function ListExperiencesDialog({isOpen, onOpenChange}: {
    isOpen: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>
}) {

    const {experiences, isLoading} = useExperiences()
    if (isLoading) return <></>

    return (
        <div className={""}>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className={"max-h-3/4 lg:max-w-fit flex flex-col"}>
                    <DialogHeader className={"flex-none"}>
                        <DialogTitle>Story experiences</DialogTitle>
                        <DialogDescription>
                            Explore our Co-Labs built story experiences. <br/>
                            They have their own seperate website, to customize their experience a bit more.
                        </DialogDescription>
                    </DialogHeader>
                    <Table className={"overflow-y-auto grow table-fixed"}>
                        <TableHeader>
                            {/* hidden, because the table header is just used to set the table column width */}
                            <TableRow className={"collapse"}>
                                <TableHead className="w-[125px]">Image</TableHead>
                                <TableHead className={"ml-2"}>Title</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {experiences.map((exp) =>
                                <TableRow key={exp.slug}
                                          className={"cursor-pointer group"}
                                          onClick={() => window.open("https://" + exp.slug + ".heritagelab.center")}>
                                    <TableCell className={"max-w-fit"}>
                                        <div
                                            className={"size-[100px] transition group-hover:scale-110 bg-accent relative"}>
                                            <Image src={exp.featured_image} alt={exp.slug + " featured image"}
                                                   fill={true} sizes={"(max-width: 100px)"} className={"object-cover"}/>
                                        </div>
                                    </TableCell>
                                    <TableCell className="*:text-wrap">
                                        <p className={"font-bold group-hover:underline"}>{exp.title}
                                            <SquareArrowOutUpRight className={"size-3 inline-block ml-1 align-top"}/>
                                        </p>
                                        <p className={"font-light"}>{exp.subtitle}</p>
                                    </TableCell>
                                </TableRow>)}
                        </TableBody>
                    </Table>
                    <DialogFooter className={"flex-none"}>
                        <DialogClose asChild>
                            <Button type={"button"} variant={"ghost"}>Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
