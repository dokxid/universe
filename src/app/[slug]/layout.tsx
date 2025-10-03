import { Impersonation } from "@workos-inc/authkit-nextjs/components";

export default function RootLayout({
    children,
    modal,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <>
            <Impersonation />
            <div>{modal}</div>
            {children}
        </>
    );
}
