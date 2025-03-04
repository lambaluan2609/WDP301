// "use client"

// import { Course } from "@prisma/client"
// import { ColumnDef } from "@tanstack/react-table"
// import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge"
// import { cn } from "@/lib/utils"

// export const columns: ColumnDef<Course>[] = [
//   {
//     accessorKey: "title",
//     header: ({ column }) => {
//         return (
//             <Button
//                 variant="ghost"
//                 onClick= {() => column.toggleSorting(column.getIsSorted() === "asc")}
//             >
//                 Title
//                 <ArrowUpDown className="ml-2 h-4 w-4" />
//             </Button>
//         )
//     },
//   },
//   {
//     accessorKey: "price",
//     header: ({ column }) => {
//         return (
//             <Button
//                 variant="ghost"
//                 onClick= {() => column.toggleSorting(column.getIsSorted() === "asc")}
//             >
//                 Price
//                 <ArrowUpDown className="ml-2 h-4 w-4" />
//             </Button>
//         )
//     },
//     cell: ({ row }) => {
//         const price = parseFloat(row.getValue("price") || "0");
//         const formatted = new Intl.NumberFormat("en-US", {
//             style: "currency",
//             currency: "USD"
//         }).format(price);
//         return <div>{formatted}</div>
//     }
//   },
//   {
//     accessorKey: "isPublished",
//     header: ({ column }) => {
//         return (
//             <Button
//                 variant="ghost"
//                 onClick= {() => column.toggleSorting(column.getIsSorted() === "asc")}
//             >
//                 Published
//                 <ArrowUpDown className="ml-2 h-4 w-4" />
//             </Button>
//         )
//     },
//     cell: ({ row }) => {
//         const isPublished = row.getValue("isPublished") || false;

//         return (
//             <Badge className={cn(
//                 "bg-slate-500",
//                 isPublished && "bg-sky-700"
//             )}>
//                 {isPublished ? "Published" : "Draft"}
//             </Badge>
//         )
//     }
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//         const { id } = row.original;

//         return (
//             <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" className="h-4 w-8 p-0">
//                         <span className="sr-only">
//                             Open Menu
//                         </span>
//                         <MoreHorizontal className="h-4 w-4"/>
//                     </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                     <Link href={`/teacher/courses/${id}`}>
//                         <DropdownMenuItem>
//                             <Pencil className="h-4 w-4 mr-2"/>
//                             Edit
//                         </DropdownMenuItem>
//                     </Link>
//                 </DropdownMenuContent>
//             </DropdownMenu>
//         )
//     }
//   }
// ]

"use client";

import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded-md"
        >
          Title
          <ArrowUpDown className="h-4 w-4 text-gray-500" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-gray-800 font-medium">{row.getValue("title")}</div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded-md"
        >
          Price
          <ArrowUpDown className="h-4 w-4 text-gray-500" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price") || "0");
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
      return <div className="text-gray-800 font-mono">{formatted}</div>;
    },
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded-md"
        >
          Published
          <ArrowUpDown className="h-4 w-4 text-gray-500" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") || false;
      return (
        <Badge
          className={cn(
            "px-2 py-1 text-xs font-semibold text-white rounded-full",
            isPublished ? "bg-sky-700" : "bg-slate-500"
          )}
        >
          {isPublished ? "Published" : "Draft"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
            >
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white shadow-md rounded-md p-1"
          >
            <Link href={`/teacher/courses/${id}`}>
              <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md cursor-pointer">
                <Pencil className="h-4 w-4 text-gray-500" />
                <span>Edit</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
