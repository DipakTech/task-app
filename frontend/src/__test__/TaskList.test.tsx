import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import useGetTasks from "@/hooks/useGetTasks";
import TaskList from "@/components/TaskList";
import { jest } from "@jest/globals";

jest.mock("@/hooks/useGetTasks");

describe("TaskList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("display hello", () => {
    render(<TaskList />);
    expect(screen.getByText("Task List")).toBeInTheDocument();
  });

  test("displays a list of tasks", () => {
    (useGetTasks as jest.MockedFunction<typeof useGetTasks>).mockReturnValue({
      data: {
        tasks: [
          {
            id: "1",
            title: "Test Task 1",
            description: "This is a test task",
            status: "pending",
          },
          {
            id: "2",
            title: "Test Task 2",
            description: "Another test task",
            status: "in progress",
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 2,
        },
      },
      isLoading: false,
    });

    render(<TaskList />);

    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText("Test Task 2")).toBeInTheDocument();
  });

  test("adds a new task", async () => {
    (useGetTasks as jest.Mock).mockReturnValue({
      data: {
        tasks: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
        },
      },
      isLoading: false,
    });

    render(<TaskList />);

    // Click the Add Task button
    fireEvent.click(screen.getByText("Add Task"));

    // Fill in the task title and description
    const titleInput = screen.getByPlaceholderText("Enter task title");
    const descriptionInput = screen.getByPlaceholderText(
      "Enter task description",
    );
    fireEvent.change(titleInput, { target: { value: "New Task" } });
    fireEvent.change(descriptionInput, {
      target: { value: "This is a new task" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("New Task")).toBeInTheDocument();
      expect(screen.getByText("This is a new task")).toBeInTheDocument();
    });
  });

  test("filters tasks by search", () => {
    (useGetTasks as jest.Mock).mockReturnValue({
      data: {
        tasks: [
          {
            id: "1",
            title: "Task 1",
            description: "This is task 1",
            status: "pending",
          },
          {
            id: "2",
            title: "Task 2",
            description: "This is task 2",
            status: "in progress",
          },
          {
            id: "3",
            title: "Specific Task",
            description: "This is a specific task",
            status: "completed",
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 3,
        },
      },
      isLoading: false,
    });

    render(<TaskList />);

    const searchInput = screen.getByPlaceholderText("Search tasks...");
    fireEvent.change(searchInput, { target: { value: "Specific" } });

    expect(screen.getByText("Specific Task")).toBeInTheDocument();
    expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
  });

  test("shows loading state", () => {
    (useGetTasks as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(<TaskList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("handles pagination", async () => {
    (useGetTasks as jest.Mock)
      .mockReturnValueOnce({
        data: {
          tasks: [
            {
              id: "1",
              title: "Task Page 1",
              description: "This is a task on page 1",
              status: "pending",
            },
          ],
          pagination: {
            currentPage: 1,
            totalPages: 2,
            totalItems: 2,
          },
        },
        isLoading: false,
      })
      .mockReturnValueOnce({
        data: {
          tasks: [
            {
              id: "2",
              title: "Task Page 2",
              description: "This is a task on page 2",
              status: "in progress",
            },
          ],
          pagination: {
            currentPage: 2,
            totalPages: 2,
            totalItems: 2,
          },
        },
        isLoading: false,
      });

    render(<TaskList />);

    expect(screen.getByText("Task Page 1")).toBeInTheDocument();
    expect(screen.queryByText("Task Page 2")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Next"));

    await waitFor(() => {
      expect(screen.getByText("Task Page 2")).toBeInTheDocument();
    });
  });
});
