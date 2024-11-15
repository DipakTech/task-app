import { getTasks } from "@/services/task.services";
import { useQuery } from "@tanstack/react-query";

export const TASKS = "TASKS";

interface GetTasksParams {
  page?: number;
  limit?: number;
}

export const useGetTasks = ({ page = 1, limit = 10 }: GetTasksParams = {}) => {
  const { data, isLoading } = useQuery({
    queryKey: [TASKS, page, limit], // Include page and limit in queryKey
    queryFn: () => getTasks({ page, limit }),
  });

  return {
    data: data?.data,
    isLoading,
  };
};
