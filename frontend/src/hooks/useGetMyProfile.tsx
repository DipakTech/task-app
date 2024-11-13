import { getMyProfile } from "@/services/task.services";
import { useQuery } from "@tanstack/react-query";

export const TASKS = "my-profile-info";

const useGetMyProfile = () => {
  const { data, isLoading } = useQuery({
    queryKey: [TASKS],
    queryFn: () => getMyProfile(),
  });

  return {
    user: data?.data,
    isFetching: isLoading,
  };
};

export default useGetMyProfile;
