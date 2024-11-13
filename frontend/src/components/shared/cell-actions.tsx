import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CheckIcon, File, FileInput, MoreVertical } from "lucide-react";
import { Task } from "../TaskList";
import useDeleteTask from "@/hooks/useDeleteTask";

import { useNavigate } from "react-router-dom";
import useUpdateTask from "@/hooks/useUpdateTask";
import useGetMyProfile from "@/hooks/useGetMyProfile";

interface CellActionProps {
  data: Task;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const deleteMutation = useDeleteTask();
  const updateTask = useUpdateTask();

  const { user } = useGetMyProfile();

  const navigate = useNavigate();
  const handleDelete = async () => {
    if (data.id && data.userId) {
      await deleteMutation.mutateAsync({
        taskId: data.id,
        userId: data.userId,
      });
    } else {
      console.error("Task ID is undefined");
    }
  };

  const handleEdit = () => {
    navigate(
      `/tasks/edit/${data.id}?title=${data.title}&description=${data.description}&status=${data.status}`,
    );
  };

  const handleChangeStatus = async () => {
    if (!data.id) {
      console.error("Task ID is undefined");
      return;
    }
    await updateTask.mutateAsync({
      id: data.id,
      task: {
        userId: data.userId,
        status: "COMPLETED",
        description: data.description,
        title: data.title,
      },
    });
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        {user?.role === "USER" ? null : (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={handleEdit}
                className="flex items-center space-x-1 hover:cursor-pointer"
              >
                <File className=" h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="flex items-center space-x-1 hover:cursor-pointer"
              >
                <FileInput className=" h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
              {data.status === "COMPLETED" ? null : (
                <DropdownMenuItem
                  onClick={handleChangeStatus}
                  className="flex items-center space-x-1 hover:cursor-pointer"
                >
                  <CheckIcon className=" h-4 w-4" />
                  <span>Mark as complete</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </>
  );
};
