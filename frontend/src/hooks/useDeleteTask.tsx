import { queryClient } from "@/main";
import { deleteTask } from "@/services/task.services";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useDeleteTask = () => {
  const mutation = useMutation<
    unknown,
    unknown,
    { taskId: string; userId: string },
    unknown
  >({
    mutationFn: ({ taskId, userId }) => deleteTask(taskId, userId),
    onError: () => {
      toast.error("error deleting task");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["TASKS"],
      });

      toast.success("task deleted successfully");
    },
  });

  return mutation;
};
