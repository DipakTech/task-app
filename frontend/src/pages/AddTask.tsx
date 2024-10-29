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
  const [isPending, startTransition] = useTransition();

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const postTask = async () => {
      try {
        await addTask(newTask);
        toast.success("Task added successfully");
        setNewTask({ title: "", description: "", status: "" });
        queryClient.invalidateQueries({
          queryKey: ["TASKS"],
        });
        navigate("/");
      } catch {
        toast.error("Failed to add task");
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
    setNewTask((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="max-w-lg w-full sm:w-[530px] mt-10 mx-auto p-1  sm:p-4">
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
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  placeholder="Enter task description"
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newTask.status}
                  onValueChange={(value) =>
                    setNewTask((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
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
