export default function NoContentLayout({
    children,
    modal,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <>
            {children}
            <div>{modal}</div>
        </>
    );
}
