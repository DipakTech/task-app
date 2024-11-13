import React, { useState, FormEvent, ChangeEvent, useTransition } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import auth from "@/services/auth.services";
import { useAuthStore } from "@/store/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();

  const { login } = useAuthStore();
  const [isPending, startTransition] = useTransition();

  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (loginForm.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    return newErrors;
  };

  const handleLoginSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    startTransition(() => {
      auth
        .login(loginForm)
        .then((user) => {
          login(user);
          toast.success("Logged in successfully");
          setLoginForm({ email: "", password: "" });
          navigate("/");
        })
        .catch((error) => {
          toast.error("Failed to log in. Please try again.");
          console.error("Login error:", error);
        });
    });
  };

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex justify-center px-4  sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className={`pl-9 ${errors.email ? "border-red-500" : ""}`}
                  value={loginForm.email}
                  onChange={handleLoginChange}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={`pl-9 ${errors.password ? "border-red-500" : ""}`}
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Loading..." : "Login"}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <Link to="/register">
            <Button variant="link" className="w-full">
              Don't have an account? Sign up
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
