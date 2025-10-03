"use client";

import { submitElevationRequest } from "@/actions/submitElevationRequest";
import { DataTableColumnHeader } from "@/app/components/stories/data-table-column-header";
import { Badge } from "@/components/ui/badge";
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
import { StoryDTO } from "@/types/dtos";
import { createColumnHelper } from "@tanstack/react-table";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import {
    Map,
    MapPinCheckInside,
    MoreHorizontal,
    Orbit,
    PencilLine,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

const columnHelper = createColumnHelper<StoryDTO>();

const ElevationRequestsActionsCell = ({ story }: { story: StoryDTO }) => {
    const pathname = usePathname();
    const slug = pathname.split("/")[1];
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Please log in to request elevation.</div>;

    const handleRejectedElevationRequest = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        console.log("Starting elevation request...");

        try {
            await submitElevationRequest(
                story._id,
                user,
                story.experience,
                "rejected"
            );
            toast.success("Elevation request set to: rejected");
        } catch (error) {
            toast.error("Error submitting elevation request: " + error);
        }
    };

    const handleApprovedElevationRequest = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        console.log("Starting elevation request...");

        try {
            await submitElevationRequest(
                story._id,
                user,
                story.experience,
                "approved"
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
                        <Link href={`/${slug}/stories/view/${story._id}`}>
                            Story page
                        </Link>
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button variant={"ghost"} className="w-full justify-start">
                        <Link href={`/${slug}/stories/view/${story._id}`}>
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

const ManageStoriesActionsCell = ({ story }: { story: StoryDTO }) => {
    const pathname = usePathname();
    const slug = pathname.split("/")[1];
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Please log in to request elevation.</div>;

    const handlePendingElevationRequest = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        console.log("Starting elevation request...");

        try {
            const result = await submitElevationRequest(
                story._id,
                user,
                story.experience,
                "pending"
            );
            toast.success("Elevation request completed: " + result);
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
                        <Link href={`/${slug}/stories/view/${story._id}`}>
                            View story
                        </Link>
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button variant={"ghost"} className="w-full justify-start">
                        <Link href={`/${slug}/stories/edit/${story._id}`}>
                            Edit story
                        </Link>
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                            toast.success(
                                `Updating Visibility for story ${story.title} to: Draft.`
                            );
                        }}
                        tabIndex={-1}
                        type="button"
                    >
                        Set as draft
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                            toast.success(
                                `Updating Visibility for story ${story.title} to: Public.`
                            );
                        }}
                        tabIndex={-1}
                        type="button"
                    >
                        Set as public
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handlePendingElevationRequest}
                        tabIndex={-1}
                        type="button"
                    >
                        Request elevation
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const manageStoryColumns = [
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
    columnHelper.accessor("author_name", {
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
                        <PencilLine size={16} className={"inline-block mr-1"} />
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
    columnHelper.accessor("visible_universe", {
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
                    {info.getValue() ? "univ" : "lab"}
                </span>
            </Badge>
        ),
    }),
    columnHelper.accessor(
        (row) =>
            row.elevation_requests[row.elevation_requests.length - 1].status,
        {
            id: "latest_elevation_request",
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Elevation Requests"
                />
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
                        <Badge className={"bg-accent text-accent-foreground"}>
                            <span className={"font-semibold"}>
                                {info.getValue()}
                            </span>
                        </Badge>
                    );
                }
            },
        }
    ),
    columnHelper.accessor("createdAt", {
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
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
            return <ManageStoriesActionsCell story={story} />;
        },
    }),
];

export const elevationRequestsColumns = [
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
    columnHelper.accessor("author_name", {
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
                        <PencilLine size={16} className={"inline-block mr-1"} />
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
    columnHelper.accessor("visible_universe", {
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
        (row) =>
            row.elevation_requests[row.elevation_requests.length - 1].status,
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
                        <Badge className={"bg-accent text-accent-foreground"}>
                            <span className={"font-semibold"}>
                                {info.getValue()}
                            </span>
                        </Badge>
                    );
                }
            },
        }
    ),
    columnHelper.accessor(
        (row) =>
            row.elevation_requests[row.elevation_requests.length - 1]
                .requested_at,
        {
            id: "requested_at",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Requested At" />
            ),
            cell: (info) => (
                <span suppressHydrationWarning>
                    {new Date(info.getValue()).toLocaleDateString()}
                </span>
            ),
        }
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
