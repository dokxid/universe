"use client";

import {
    ColumnFiltersState,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { StoryDTO } from "@/types/dtos";
import Link from "next/link";
import {
    ChevronDown,
    Columns3,
    MapPinCheckInside,
    MoreHorizontal,
    Map,
    Orbit,
    PencilLine,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { submitElevationRequestAction } from "@/actions/submit-elevation-request";
import { useCurrentUser } from "@/lib/swr/user-hook";
import { usePathname } from "next/navigation";
import { DataTableColumnHeader } from "./data-table-column-header";

interface DataTableProps {
    data: string; // JSON stringified array of TData
}

const ElevationRequestsActionsCell = ({ story }: { story: StoryDTO }) => {
    const pathname = usePathname();
    const slug = pathname.split("/")[1];
    const { user: initialUser, isLoading, isError } = useCurrentUser();
    if (isLoading) return <div>Loading...</div>;
    if (!initialUser) return <div>Please log in to request elevation.</div>;
    if (isError) return <div>Error loading user data.</div>;

    const handleRejectedElevationRequest = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await submitElevationRequestAction(
                story.id,
                story.lab.slug,
                "rejected",
            );
            toast.success("Elevation request set to: rejected");
        } catch (error) {
            toast.error("Error submitting elevation request: " + error);
        }
    };

    const handleApprovedElevationRequest = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await submitElevationRequestAction(
                story.id,
                story.lab.slug,
                "approved",
            );
            toast.success("Elevation request set to: approved");
        } catch (error) {
            toast.error("Error submitting elevation request: " + error);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    <p className={"font-bold"}>Actions</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Button variant={"ghost"} className="w-full justify-start">
                        <Link href={`/${slug}/stories/view/${story.id}`}>
                            Story page
                        </Link>
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button variant={"ghost"} className="w-full justify-start">
                        <Link href={`/${slug}/stories/view/${story.id}`}>
                            Elevation history
                        </Link>
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleApprovedElevationRequest}
                        tabIndex={-1}
                        type="button"
                    >
                        Approve elevation
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleRejectedElevationRequest}
                        tabIndex={-1}
                        type="button"
                    >
                        Reject elevation
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export function ElevationRequestsTable<TData extends StoryDTO>({
    data,
}: DataTableProps) {
    const [rowSelection, setRowSelection] = React.useState({});
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({
            title: true,
            author_name: false,
            draft: false,
            published: false,
            visible_universe: false,
            latest_elevation_request: true,
            requested_at: true,
            createdAt: false,
            updatedAt: false,
        });
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([
            { id: "latest_elevation_request", value: "pending" },
        ]);
    const dataFetched = React.useMemo(
        () => JSON.parse(data) as StoryDTO[] as TData[],
        [data],
    );
    const columnHelper = createColumnHelper<StoryDTO>();

    const columns = [
        columnHelper.display({
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    className={"mr-2"}
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        }),
        columnHelper.accessor("title", {
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Title" />
            ),
            cell: (info) => <span className={""}>{info.getValue()}</span>,
        }),
        columnHelper.accessor((row) => row.author.name, {
            id: "authorName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Author" />
            ),
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("draft", {
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Draft" />
            ),
            cell: (info) => (
                <Badge
                    className={
                        info.getValue()
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-green-400 text-secondary-foreground dark:text-primary-foreground"
                    }
                >
                    <span
                        className={
                            "font-semibold w-15 flex justify-center items-center"
                        }
                    >
                        {info.getValue() ? (
                            <PencilLine
                                size={16}
                                className={"inline-block mr-1"}
                            />
                        ) : (
                            <MapPinCheckInside
                                size={16}
                                className={"inline-block mr-1"}
                            />
                        )}
                        {info.getValue() ? "draft" : "public"}
                    </span>
                </Badge>
            ),
        }),
        columnHelper.accessor("visibleUniverse", {
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="On Level" />
            ),
            cell: (info) => (
                <Badge
                    className={
                        info.getValue()
                            ? "bg-green-400 text-secondary-foreground dark:text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                    }
                >
                    <span
                        className={
                            "font-semibold w-15 flex justify-center items-center"
                        }
                    >
                        {info.getValue() ? (
                            <Orbit size={16} className={"inline-block mr-1"} />
                        ) : (
                            <Map size={16} className={"inline-block mr-1"} />
                        )}
                        {info.getValue() ? "public" : "lab"}
                    </span>
                </Badge>
            ),
        }),
        columnHelper.accessor(
            (row) => {
                const lastRequest =
                    row.elevationRequests?.[row.elevationRequests.length - 1];
                return lastRequest?.status ?? "pending";
            },
            {
                id: "latest_elevation_request",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Status" />
                ),
                cell: (info) => {
                    if (info.getValue() === "approved") {
                        return (
                            <Badge
                                className={
                                    "bg-green-400 text-secondary-foreground dark:text-primary-foreground"
                                }
                            >
                                <span className={"font-semibold"}>
                                    {info.getValue()}
                                </span>
                            </Badge>
                        );
                    } else if (info.getValue() === "rejected") {
                        return (
                            <Badge
                                className={
                                    "bg-red-400 text-secondary-foreground dark:text-primary-foreground"
                                }
                            >
                                <span className={"font-semibold"}>
                                    {info.getValue()}
                                </span>
                            </Badge>
                        );
                    } else {
                        return (
                            <Badge
                                className={"bg-accent text-accent-foreground"}
                            >
                                <span className={"font-semibold"}>
                                    {info.getValue()}
                                </span>
                            </Badge>
                        );
                    }
                },
            },
        ),
        columnHelper.accessor(
            (row) => {
                const lastRequest =
                    row.elevationRequests?.[row.elevationRequests.length - 1];
                return lastRequest?.createdAt ?? new Date().toISOString();
            },
            {
                id: "requested_at",
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title="Requested At"
                    />
                ),
                cell: (info) => (
                    <span suppressHydrationWarning>
                        {new Date(info.getValue()).toLocaleDateString()}
                    </span>
                ),
            },
        ),
        columnHelper.accessor("createdAt", {
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="created at" />
            ),
            cell: (info) => {
                return (
                    <span suppressHydrationWarning>
                        {new Date(info.getValue()).toLocaleDateString()}
                    </span>
                );
            },
        }),
        columnHelper.accessor("updatedAt", {
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Updated At" />
            ),
            cell: (info) => {
                return (
                    <span suppressHydrationWarning>
                        {new Date(info.getValue()).toLocaleDateString()}
                    </span>
                );
            },
        }),
        columnHelper.display({
            id: "actions",
            cell: ({ row }) => {
                const story = row.original;
                return <ElevationRequestsActionsCell story={story} />;
            },
        }),
    ];
    const table = useReactTable({
        data: dataFetched,
        columns,
        getRowId: (row) => row.id,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        state: {
            rowSelection,
            sorting,
            columnVisibility,
            columnFilters,
        },
        onSortingChange: setSorting,
    });

    return (
        <div className={"max-w-6xl w-full"}>
            <div className="flex items-center py-4 justify-between">
                <Input
                    placeholder="Filter stories..."
                    value={table.getColumn("title")?.getFilterValue() as string}
                    onChange={(event) =>
                        table
                            .getColumn("title")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <div className={"flex items-center gap-2"}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="primary_custom"
                                disabled={
                                    Object.keys(rowSelection).length === 0
                                }
                                className="ml-auto"
                            >
                                Bulk actions <ChevronDown size={16} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onClick={() => {
                                        const selectedIds =
                                            Object.keys(rowSelection);
                                        toast.success(
                                            `Updating Status for ${selectedIds.length} stories to: Approved.`,
                                        );
                                    }}
                                    tabIndex={-1}
                                    type="button"
                                >
                                    Elevate
                                </Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onClick={() => {
                                        const selectedIds =
                                            Object.keys(rowSelection);
                                        toast.success(
                                            `Updating Status for ${selectedIds.length} stories to: Rejected.`,
                                        );
                                    }}
                                    tabIndex={-1}
                                    type="button"
                                >
                                    Reject
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="secondary_custom"
                                size={"icon"}
                                className="ml-auto"
                            >
                                <Columns3 size={16} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className=""
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext(),
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
