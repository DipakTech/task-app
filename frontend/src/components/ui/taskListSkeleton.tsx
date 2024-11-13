import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, MoreHorizontalIcon } from "lucide-react";

export default function TaskListSkeleton() {
  return (
    <div className="w-full px-2 max-w-5xl mx-auto flex flex-col animate-pulse">
      <div className="flex justify-between items-start sm:items-center gap-4 mb-6">
        <div className="h-8 bg-gray-200 rounded w-32 dark:bg-gray-700"></div>
        <div className="h-9 bg-gray-200 rounded w-24 dark:bg-gray-700"></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            className="pl-10 w-full bg-gray-200 dark:bg-gray-700"
            disabled
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
          disabled
        >
          <MoreHorizontalIcon className="mr-2 h-4 w-4" />
          View
        </Button>
        <div className="h-5 bg-gray-200 rounded w-32 dark:bg-gray-700"></div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-full">
            <TableHeader>
              <TableRow>
                {[1, 2, 3, 4].map((i) => (
                  <TableHead key={i} className="px-4 sm:px-6">
                    <div className="h-4 bg-gray-200 rounded w-20 dark:bg-gray-700"></div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5, 6, 7].map((row) => (
                <TableRow key={row}>
                  {[1, 2, 3, 4].map((cell) => (
                    <TableCell key={cell} className="px-4 sm:px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-full dark:bg-gray-700"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="h-4 bg-gray-200 rounded w-32 dark:bg-gray-700"></div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
