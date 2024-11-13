import { PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate("/tasks/new")}
      size="sm"
      className="h-7 gap-1 p-4 "
    >
      <PlusCircle className="h-4 w-4 mr-1" />
      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
        Add Task
      </span>
    </Button>
  );
};

export default AddTask;
