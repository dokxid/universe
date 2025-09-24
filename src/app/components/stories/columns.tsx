"use client";

import { submitElevationRequest } from "@/actions/submitElevationRequest";
import { DataTableColumnHeader } from "@/app/components/stories/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StoryDTO } from "@/types/api";
import { ColumnDef } from "@tanstack/react-table";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ManageStoriesActionsCell = ({ story }: { story: StoryDTO }) => {
    const pathname = usePathname();
    const slug = pathname.split("/")[1];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={`/${slug}/stories/${story._id}`}>
                        View story
                    </Link>
                    <Link href={`/${slug}/stories/edit/${story._id}`}>
                        Edit story
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const ElevationRequestsActionsCell = ({ story }: { story: StoryDTO }) => {
    const pathname = usePathname();
    const slug = pathname.split("/")[1];
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Please log in to request elevation.</div>;

    const handleElevationRequest = async () => {
        await submitElevationRequest(story.experience, user, story._id);
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
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={`/${slug}/stories/${story._id}`}>
                        View story
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <form action={handleElevationRequest}>
                        <Button type="submit">Request elevation</Button>
                    </form>
                </DropdownMenuItem>
                <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const manageStoryColumns: ColumnDef<StoryDTO>[] = [
    {
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
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Title" />
        ),
    },
    {
        accessorKey: "author_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Author" />
        ),
    },
    {
        accessorKey: "published",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Published" />
        ),
    },
    {
        accessorKey: "visible_universe",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Visible Universe" />
        ),
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => {
            const story = row.original;
            return (
                <span suppressHydrationWarning>
                    {new Date(story.createdAt).toLocaleDateString()}
                </span>
            );
        },
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Updated At" />
        ),
        cell: ({ row }) => {
            const story = row.original;
            return (
                <span suppressHydrationWarning>
                    {new Date(story.updatedAt).toLocaleDateString()}
                </span>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const story = row.original;
            return <ManageStoriesActionsCell story={story} />;
        },
    },
];

export const elevationRequestColumns: ColumnDef<StoryDTO>[] = [
    {
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
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Title"
                className={"w-fit"}
            />
        ),
        size: 100,
    },
    {
        accessorKey: "author_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Author" />
        ),
    },
    {
        id: "status",
        accessorFn: (row) =>
            row.elevation_requests?.[row.elevation_requests.length - 1]
                .status ?? "Unknown",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const story = row.original;
            const status =
                story.elevation_requests?.[story.elevation_requests.length - 1]
                    .status;
            return (
                <span suppressHydrationWarning>{status ? status : "N/A"}</span>
            );
        },
    },
    {
        id: "updated_at",
        accessorFn: (row) =>
            row.elevation_requests?.[row.elevation_requests.length - 1]
                .updated_at ?? "",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Updated At" />
        ),
        cell: ({ row }) => {
            const story = row.original;
            const updatedAt =
                story.elevation_requests?.[story.elevation_requests.length - 1]
                    .updated_at;
            return (
                <span suppressHydrationWarning>
                    {updatedAt
                        ? new Date(updatedAt).toLocaleDateString()
                        : "N/A"}
                </span>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const story = row.original;
            return <ElevationRequestsActionsCell story={story} />;
        },
    },
];
