export function buildConnectionString(
    envUri: string,
    envDbName: string
): string {
    const uri = envUri;
    const dbName = envDbName;
    const url = new URL(uri);
    const pathname = url.pathname;

    if (pathname === "/" || pathname === "") {
        url.pathname = `/${dbName}`;
    } else if (!pathname.includes(dbName)) {
        url.pathname = `/${dbName}`;
    }

    return url.toString();
}
