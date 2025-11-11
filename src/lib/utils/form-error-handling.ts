import { ErrorOption, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export const handleAPIFormErrors = <T extends FieldValues>(
    result: { code: string, message: string } | null | undefined,
    form: UseFormReturn<T>
) => {
    if (result?.code === "UNAUTHORIZED") {
        toast.error("You are not authorized to perform this action.");
        return;
    }
    if (result?.code === "INVALID_EMAIL_OR_PASSWORD") {
        form.setError("email" as Path<T>, {
            type: "server" as const,
            message: "Invalid email or password.",
        } as ErrorOption);
        form.setError("password" as Path<T>, {
            type: "server" as const,
            message: "Invalid email or password.",
        } as ErrorOption);
        toast.error("Invalid email or password.");
        return;
    }
}

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
