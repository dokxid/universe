export function errorSanitizer(error: unknown) {
    if (typeof error === "string") {
        return new Response(error, {status: 500})
    } else if (error instanceof Error) {
        return new Response(error.message, {status: 500})
    } else {
        return new Response(JSON.stringify(error), {status: 500})
    }
}