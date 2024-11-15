import { getMyProfile } from "@/services/task.services";
import { useQuery } from "@tanstack/react-query";

export const TASKS = "my-profile-info";

export const useGetMyProfile = () => {
  const { data, isLoading } = useQuery({
    queryKey: [TASKS],
    queryFn: () => getMyProfile(),
  });

  return {
    user: data?.data,
    isFetching: isLoading,
  };
};
