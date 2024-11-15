import { useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type SortingState,
  ColumnDef,
  PaginationState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Search } from "lucide-react";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "./ui/table";
import AddTask from "./AddTask";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import useGetTasks from "@/hooks/useGetTasks";
import { CellAction } from "./shared/cell-actions";
import TaskListSkeleton from "./ui/taskListSkeleton";
import { Badge } from "./ui/badge";
import { useAuthStore } from "@/store/auth";

export type Task = {
  id?: string;
  title?: string;
  description?: string;
  status?: string;
  userId?: string;
};

const TaskList = () => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const { isAuth, token } = useAuthStore();

  const { data, isLoading } = useGetTasks({
    page: pageIndex + 1,
    limit: pageSize,
  });

  const tasks = data?.tasks ?? [];
  const pagination = data?.pagination;

  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent flex items-center gap-1 group"
          >
            Title
            <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          </Button>
        ),
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent flex items-center gap-1 group"
          >
            Description
            <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          </Button>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent flex items-center gap-1 group"
          >
            Status
            <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          </Button>
        ),
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          const statusStyles = {
            completed: "bg-green-50 text-green-700 border-green-100",
            "in progress": "bg-blue-50 text-blue-700 border-blue-100",
            pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
          };

          const statusKey = status.toLowerCase() as keyof typeof statusStyles;
          const style =
            statusStyles[statusKey] ||
            "bg-gray-50 text-gray-700 border-gray-100";

          return (
            <Badge
              className={` rounded-full text-xs  font-medium border ${style}`}
            >
              {status}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        accessorKey: "Actions",
        cell: ({ row }) => (
          <> {isAuth && token ? <CellAction data={row.original} /> : null}</>
        ),
      },
    ],
    [isAuth, token],
  );

  const table = useReactTable({
    data: tasks,
    columns,
    pageCount: pagination?.totalPages ?? -1,
    state: {
      sorting,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
  });

  if (isLoading) return <TaskListSkeleton />;

  return (
    <div className="w-full px-2 max-w-5xl mx-auto flex flex-col ">
      <div className="flex justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-2xl font-bold bg-gray-100 dark:bg-slate-950">
          Task List
        </h1>
        {isAuth && token && <AddTask />}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            placeholder="Search tasks..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto hidden h-8 lg:flex"
            >
              <MixerHorizontalIcon className="mr-2 h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="text-sm text-gray-500 w-full sm:w-auto">
          {pagination?.totalItems ?? 0} tasks total
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="px-4 sm:px-6 text-left text-xs sm:text-sm font-medium text-gray-500 tracking-wider transition-colors"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="divide-y px-4 ">
              {tasks.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-2 py-1 sm:py-2 text-xs sm:text-sm dark:text-gray-400 break-words"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 sm:px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No tasks found. Try adjusting your search criteria.
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-gray-500">
          Page {pagination?.currentPage} of {pagination?.totalPages}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!pagination?.hasPrevPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!pagination?.hasNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
