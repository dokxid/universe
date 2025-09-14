import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Button} from "@mui/material";
import {Dispatch, SetStateAction} from "react";
import {Table, TableBody, TableCaption, TableCell, TableRow} from "@/components/ui/table";
import {useExperiences} from "@/lib/data_hooks/experiencesHook";
import {Spinner} from "@/components/ui/shadcn-io/spinner";

export function ListExperiencesDialog({isOpen, onOpenChange}: {
    isOpen: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>
}) {

    const {experiences, isLoading} = useExperiences()
    if (isLoading) return <Spinner/>

    return (
        <div>

            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className={"overflow-y-scroll max-h-screen lg:max-w-fit"}>
                    <DialogHeader>
                        <DialogTitle>Story experiences</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <Table>
                        <TableCaption>A list of your recent invoices.</TableCaption>
                        {/*<TableHeader>*/}
                        {/*    <TableRow>*/}
                        {/*        <TableHead className="w-[100px]">Image</TableHead>*/}
                        {/*        <TableHead>Title</TableHead>*/}
                        {/*        <TableHead>Link</TableHead>*/}
                        {/*    </TableRow>*/}
                        {/*</TableHeader>*/}
                        <TableBody>
                            {experiences.map((exp) => <TableRow key={exp.slug}>
                                <TableCell>
                                    <div className={"size-[100px] bg-accent"}></div>
                                </TableCell>
                                <TableCell className="font-medium">{exp.title}</TableCell>
                                <TableCell><a
                                    href={"https://" + exp.slug + ".heritagelab.center"}>{exp.slug}.heritagelab.center</a></TableCell>
                            </TableRow>)}
                        </TableBody>
                    </Table>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type={"button"} variant={"text"}>Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
