import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { queryClient } from "@/main";
import { useNavigate } from "react-router-dom";
import { taskSchema } from "@/validations/task";
import useAddTask from "@/hooks/useAddTask";
import { Loader } from "@/components/shared/Loader/BaseLoader";

export type Task = {
  title: string;
  description: string;
  status: string;
};

export function AddTaskPage() {
  const [newTask, setNewTask] = useState<Task>({
    title: "",
    description: "",
    status: "",
  });

  const taskAddMutation = useAddTask();

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    status?: string;
  }>({});
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = taskSchema.safeParse(newTask);

    if (!result.success) {
      const fieldErrors: {
        title?: string;
        description?: string;
        status?: string;
      } = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof typeof fieldErrors;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error("Error adding task. Please fix the highlighted fields.");
      return;
    }
    setErrors({});

    try {
      await taskAddMutation.mutateAsync(newTask);
      setNewTask({ title: "", description: "", status: "" });
      queryClient.invalidateQueries({ queryKey: ["TASKS"] });
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add task. Please try again later.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setNewTask((prev) => ({ ...prev, [id]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [id]: undefined }));
  };

  return (
    <div className="max-w-lg w-full sm:w-[530px] mx-auto p-1">
      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
          <CardDescription>
            Fill out the form to create a new task.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  placeholder="Enter task title"
                  className={`${errors.title ? "border-red-500" : ""}`}
                />
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  placeholder="Enter task description"
                  className={`min-h-[100px] ${
                    errors.description ? "border-red-500" : ""
                  }`}
                />
                {errors.description && (
                  <p className="text-xs text-red-500">{errors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newTask.status}
                  onValueChange={(value) => {
                    setNewTask((prev) => ({ ...prev, status: value }));
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      status: undefined,
                    }));
                  }}
                >
                  <SelectTrigger
                    className={`${errors.status ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-xs text-red-500">{errors.status}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={taskAddMutation.isPending}
              className="w-full"
            >
              {taskAddMutation.isPending ? (
                <p className="flex items-center justify-center gap-2">
                  <Loader
                    show
                    wrapperClass="text-gray-500"
                    loaderClass="text-gray-500"
                  />
                  <span>Adding task</span>
                </p>
              ) : (
                "Add Task"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddTaskPage;
