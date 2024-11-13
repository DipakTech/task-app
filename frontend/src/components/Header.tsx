import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuthStore } from "@/store/auth";
import auth from "@/services/auth.services";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ThemeToggle } from "./ui/themeToggle";

export default function Header() {
  const { isAuth, logout } = useAuthStore();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.logout();
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="mx-auto relative  flex justify-center w-full max-w-7xl flex-1 overflow-hidden dark:text-slate-900 z-50">
      <div className="z-0  flex-1 overflow-y-scroll">
        <header className="fixed  justify-between inset-x-0 md:px-2 flex h-14 shadow backdrop-blur-md">
          <div className="mx-auto flex w-11/12 md:w-full max-w-5xl items-center  rounded-full mt-2  md:px-2 justify-between ">
            <div className="flex w-11/12 justify-between bg-white dark:bg-slate-950  rounded-full">
              <div>
                <Link to={"/"}>
                  <p className="flex origin-left items-center text-lg font-semibold uppercase cursor-pointer mt-1">
                    <span className="-ml-1.5 inline-block -rotate-90 text-[8px] text-slate-900 dark:text-slate-300 dark:hover:text-white leading-[0]">
                      Task
                    </span>
                    <span className="-ml-1 text-xl text-slate-900 dark:text-slate-300 dark:hover:text-white tracking-[-.075em]">
                      Manage
                    </span>
                  </p>
                </Link>
              </div>

              <nav className="sm:flex items-center space-x-6 text-sm font-medium text-slate-400">
                <div className="flex gap-2 items-center">
                  {!isAuth ? (
                    <Link to={"/login"}>
                      <Button
                        className="text-md bg-black text-white dark:text-slate-300"
                        variant="gooeyLeft"
                        Icon={ArrowRightIcon}
                        iconPlacement="right"
                      >
                        Login
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="outline"
                      className="bg-transparent py-1"
                      onClick={handleLogout}
                      Icon={ArrowRightIcon}
                      iconPlacement="right"
                    >
                      logout
                    </Button>
                  )}
                </div>
              </nav>
            </div>
            <ThemeToggle />
          </div>
        </header>
      </div>
    </div>
  );
}
