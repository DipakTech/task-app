import { queryClient } from "@/main";
import { Task } from "@/pages/AddTask";
import { addTask } from "@/services/task.services";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useAddTask = () => {
  const mutation = useMutation<unknown, unknown, Task, unknown>({
    mutationFn: (task) => addTask(task),
    onError: () => {
      toast.error("error adding task");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["TASKS"],
      });

      toast.success("task added successfully");
    },
  });

  return mutation;
};
