export default function SlugLayout({
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
