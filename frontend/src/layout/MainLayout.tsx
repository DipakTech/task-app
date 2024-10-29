import Header from "@/components/Header";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainLayout = () => {
  return (
    <>
      <div className="overflow-x-hidden flex flex-col gap-10">
        <Header />

        <Outlet />
        <ToastContainer />
      </div>
    </>
  );
};

export default MainLayout;
