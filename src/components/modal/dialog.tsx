import { Dialog as CNDialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";

export function Dialog({
    children,
    title,
    description,
}: {
    children: React.ReactNode;
    title: string;
    description: string;
}) {
    const router = useRouter();
    return (
        <CNDialog
            defaultOpen={true}
            open={true}
            onOpenChange={() => {
                router.back();
            }}
            
        >
            <VisuallyHidden>
                <DialogTitle>{title}</DialogTitle>
            </VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Card>
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent>{children}</CardContent>
                </Card>
            </DialogContent>
        </CNDialog>
    );
}
