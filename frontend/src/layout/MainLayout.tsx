import Header from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { ThemeProvider } from "@/components/ui/themeProvider";
import { useTheme } from "next-themes";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainLayout = () => {
  const { theme } = useTheme();

  console.log("theme", theme);

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="overflow-x-hidden flex flex-col gap-7 bg-white dark:bg-slate-950">
          <Header />
          <div className="mt-7">
            <Separator className="w-full dark:bg-slate-900 h-[2px]" />
          </div>
          <div className="p-2">
            <Outlet />
          </div>
          <ToastContainer
            position="top-right"
            autoClose={1000}
            rtl={false}
            draggable
            theme={theme === "dark" ? "dark" : "light"}
          />
        </div>
      </ThemeProvider>
    </>
  );
};

export default MainLayout;
