import { queryClient } from "@/main";
import { deleteTask } from "@/services/task.services";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useDeleteTask = () => {
  const mutation = useMutation<unknown, unknown, string, unknown>({
    mutationFn: (id) => deleteTask(id),
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

export default useDeleteTask;
