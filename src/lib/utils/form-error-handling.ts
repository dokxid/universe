import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export const handleFormErrors = <T extends FieldValues>(
    result: { error?: string } | null | undefined,
    form: UseFormReturn<T>
) => {
    if (result?.error) {
        if (!result.error.startsWith("{")) {
            toast.error("Failed to create lab: " + result.error);
            return;
        }
        const zodErrors = JSON.parse(result.error);
        Object.keys(zodErrors.fieldErrors).forEach((fieldName: keyof T) => {
            form.setError(fieldName as Path<T>, {
                type: "server",
                message: zodErrors.fieldErrors[fieldName].join(", "),
            });
        });
        zodErrors.formErrors.forEach((error: string) => {
            toast.error(error);
        });
    }
};
