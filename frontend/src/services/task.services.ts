import { axiosInstance } from "./base/axiosBaseInstance";

export const getTasks = ({ page, limit }: { page: number; limit: number }) =>
  axiosInstance.get(`/tasks?page=${page}&limit=${limit}`);

export const addTask = (task: {
  title: string;
  description: string;
  status: string;
}) => axiosInstance.post(`/tasks`, task);

export const deleteTask = (taskId: string, userId: string) =>
  axiosInstance.delete(`/tasks/${taskId}/${userId}`);

export const updateTask = (
  id: string,
  task: {
    title?: string;
    description?: string;
    status?: string;
  },
) => axiosInstance.put(`/tasks/${id}`, task);

export const getMyProfile = () => axiosInstance.get(`/auth/profile`);
