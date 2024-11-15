import { Task } from "@/components/TaskList";
import { queryClient } from "@/main";
import { updateTask } from "@/services/task.services";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateTask = () => {
  const mutation = useMutation<
    unknown,
    unknown,
    { id: string; task: Task },
    unknown
  >({
    mutationFn: ({ id, task }) => updateTask(id, task),
    onError: () => {
      toast.error("error updating task");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["TASKS"],
      });

      toast.success("task updated successfully");
    },
  });

  return mutation;
};
