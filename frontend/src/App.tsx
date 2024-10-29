import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import TaskList from "./components/TaskList";
import LoginPage from "./pages/Login";
import MainLayout from "./layout/MainLayout";
import { AddTaskPage } from "./pages/AddTask";
import RegisterPage from "./pages/Register";
import EditTaskPage from "./pages/EditTask";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<TaskList />} />
          <Route path="/tasks/new" element={<AddTaskPage />} />
          <Route path="/tasks/edit/:id" element={<EditTaskPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/protected" element={<TaskList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
