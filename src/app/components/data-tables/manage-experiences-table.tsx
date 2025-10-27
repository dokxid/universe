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

import { DataTableColumnHeader } from "@/app/components/data-tables/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { LabDTO } from "@/types/dtos";
import { ChevronDown, Columns3, MoreHorizontal, UserPlus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

const ManageExperiencesActionsCell = ({ lab }: { lab: LabDTO }) => {
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
                    <p className={"font-bold"}>Lab Actions</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={`/universe/labs/view/${lab.id}`}>
                        View Lab details
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {}}
                        tabIndex={-1}
                        type="button"
                    >
                        Copy organization ID
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {}}
                        tabIndex={-1}
                        type="button"
                    >
                        Set visibility
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                            toast.success(
                                `Removed ${lab.name} from Heritage Lab successfully.`,
                            );
                        }}
                        tabIndex={-1}
                        type="button"
                    >
                        Remove Lab
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

interface DataTableProps {
    data: string; // JSON stringified array of TData
}

export function ManageExperiencesTable({ data }: DataTableProps) {
    const [rowSelection, setRowSelection] = React.useState({});
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const dataFetched = React.useMemo(
        () => JSON.parse(data) as LabDTO[],
        [data],
    );

    const columnHelper = createColumnHelper<LabDTO>();

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
        columnHelper.accessor("name", {
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: (info) => (
                <Link href={`/universe/labs/view/${info.row.original.id}`}>
                    <span className={"hover:underline"}>
                        {info.getValue() || "N/A"}
                    </span>
                </Link>
            ),
        }),
        columnHelper.accessor("slug", {
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Slug" />
            ),
            cell: (info) => (
                <Link href={`/${info.getValue()}`} target={"_blank"}>
                    <span className={"hover:underline after:content-['_↗']"}>
                        {`/${info.getValue()}` || "N/A"}
                    </span>
                </Link>
            ),
        }),
        columnHelper.accessor((row) => row.amountStories, {
            id: "storiesCount",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Stories" />
            ),
            cell: (info) => (
                <Link href={`/${info.row.original.slug}/stories`}>
                    <span className={"hover:underline"}>
                        {info.getValue() || 0}
                    </span>
                </Link>
            ),
        }),
        columnHelper.accessor("visibility", {
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Visibility" />
            ),
            cell: (info) => (
                <span className={""}>{info.getValue() || "N/A"}</span>
            ),
        }),
        columnHelper.display({
            id: "actions",
            cell: ({ row }) => {
                const experience = row.original;
                return <ManageExperiencesActionsCell lab={experience} />;
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
            <div>
                <div className="flex items-center py-4 justify-between">
                    <Input
                        placeholder="Filter users..."
                        value={
                            table.getColumn("name")?.getFilterValue() as string
                        }
                        onChange={(event) =>
                            table
                                .getColumn("name")
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
                                                `Elevation for ${selectedIds.length} stories have been requested`,
                                            );
                                        }}
                                        tabIndex={-1}
                                        type="button"
                                    >
                                        Request elevation
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
                                                `Updating Visibility for ${selectedIds.length} stories to: Draft.`,
                                            );
                                        }}
                                        tabIndex={-1}
                                        type="button"
                                    >
                                        Set visibility to Draft
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
                                                `Updating Visibility for ${selectedIds.length} stories to: Map.`,
                                            );
                                        }}
                                        tabIndex={-1}
                                        type="button"
                                    >
                                        Set visibility to Map
                                    </Button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Link href={"/universe/labs/create"}>
                            <Button variant={"secondary_custom"} className={""}>
                                <UserPlus />
                                Create new lab
                            </Button>
                        </Link>
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
                                                    column.toggleVisibility(
                                                        !!value,
                                                    )
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
                                                          header.column
                                                              .columnDef.header,
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
        </div>
    );
}
