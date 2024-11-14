import { useState, useTransition } from "react";
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
import { addTask } from "@/services/task.services";
import { toast } from "react-toastify";
import { queryClient } from "@/main";
import { useNavigate } from "react-router-dom";
import { taskSchema } from "@/validations/task";

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
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    status?: string;
  }>({});
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
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

    const postTask = async () => {
      try {
        await addTask(newTask);
        toast.success("Task added successfully");
        setNewTask({ title: "", description: "", status: "" });
        queryClient.invalidateQueries({ queryKey: ["TASKS"] });
        navigate("/");
      } catch (error) {
        console.log(error);
        toast.error("Failed to add task. Please try again later.");
      }
    };

    startTransition(() => {
      postTask();
    });
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
                  <p className="text-sm text-red-500">{errors.title}</p>
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
                  <p className="text-sm text-red-500">{errors.description}</p>
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
                  <p className="text-sm text-red-500">{errors.status}</p>
                )}
              </div>
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Adding Task..." : "Add Task"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddTaskPage;
