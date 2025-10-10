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
import { UserDTO } from "@/lib/data/mongodb/models/user-model";
import { ChevronDown, Columns3, MoreHorizontal } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { InviteMemberDialog } from "@/app/components/modal/invite-member-dialog";

const ManageUsersActionsCell = ({ user }: { user: UserDTO }) => {
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
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {}}
                        tabIndex={-1}
                        type="button"
                    >
                        View profile
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                            toast.success(
                                `Removed ${user.firstName} ${user.lastName} from Heritage Lab successfully.`
                            );
                        }}
                        tabIndex={-1}
                        type="button"
                    >
                        Remove user
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

interface DataTableProps {
    data: string; // JSON stringified array of TData
    slug: string;
}

export function ManageUsersTable({ data, slug }: DataTableProps) {
    const [rowSelection, setRowSelection] = React.useState({});
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const dataFetched = React.useMemo(
        () => JSON.parse(data) as UserDTO[],
        [data]
    );

    const columnHelper = createColumnHelper<UserDTO>();

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
        columnHelper.accessor("firstName", {
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="First Name" />
            ),
            cell: (info) => (
                <span className={""}>{info.getValue() || "N/A"}</span>
            ),
        }),
        columnHelper.accessor("lastName", {
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Last Name" />
            ),
            cell: (info) => (
                <span className={""}>{info.getValue() || "N/A"}</span>
            ),
        }),
        columnHelper.accessor(
            (row) => row.labs?.filter((lab) => lab.slug === slug)[0]?.role,
            {
                id: "role",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Role" />
                ),
                cell: (info) => (
                    <span className={""}>{info.getValue() || "N/A"}</span>
                ),
            }
        ),
        columnHelper.accessor("email", {
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Email" />
            ),
            cell: (info) => <span className={""}>{info.getValue()}</span>,
        }),
        columnHelper.display({
            id: "actions",
            cell: ({ row }) => {
                const user = row.original;
                return <ManageUsersActionsCell user={user} />;
            },
        }),
    ];

    const table = useReactTable({
        data: dataFetched,
        columns,
        getRowId: (row) => row._id,
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
                            table
                                .getColumn("firstName")
                                ?.getFilterValue() as string
                        }
                        onChange={(event) =>
                            table
                                .getColumn("firstName")
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
                                                `Elevation for ${selectedIds.length} stories have been requested`
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
                                                `Updating Visibility for ${selectedIds.length} stories to: Draft.`
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
                                                `Updating Visibility for ${selectedIds.length} stories to: Map.`
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
                        <InviteMemberDialog slug={slug} />
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
                                                        !!value
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
                                                          header.getContext()
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
                                                    cell.getContext()
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
