import { axiosInstance } from "./base/axiosBaseInstance";

export const getTasks = ({ page, limit }: { page: number; limit: number }) =>
  axiosInstance.get(`/tasks?page=${page}&limit=${limit}`);

export const addTask = (task: {
  title: string;
  description: string;
  status: string;
}) => axiosInstance.post(`/tasks`, task);

export const deleteTask = (id: string) => axiosInstance.delete(`/tasks/${id}`);

export const updateTask = (
  id: string,
  task: {
    title?: string;
    description?: string;
    status?: string;
  },
) => axiosInstance.put(`/tasks/${id}`, task);
