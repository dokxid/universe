export function DebugListObject({
    data,
    className,
}: {
    data: object;
    className?: string;
}) {
    return (
        <div
            className={`flex flex-col overflow-x-auto w-full mt-10 bg-primary text-primary-foreground p-4 ${className}`}
        >
            {Object.keys(data).length === 0 ? (
                <div className="text-sm italic text-gray-500">No data</div>
            ) : null}
            {Object.entries(data).map(([key, value]) => (
                <p key={key}>
                    <code className={"break-all"}>
                        {key}: {JSON.stringify(value)}
                    </code>
                </p>
            ))}
        </div>
    );
}
