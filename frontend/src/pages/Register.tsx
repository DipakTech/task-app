import React, { useState, FormEvent, ChangeEvent, useTransition } from "react";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import { z } from "zod";
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
import { Link, useNavigate } from "react-router-dom";
import { registerSchema } from "@/validations/registerValidation";
import { toast } from "react-toastify";

type RegisterFormData = z.infer<typeof registerSchema>;

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
  });

  const handleRegisterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form data
    const result = registerSchema.safeParse(registerForm);

    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof FormErrors;
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const registerUser = async () => {
      try {
        const response = await auth.register(registerForm);
        console.log(response, "response..");

        // Reset form and display success message
        setRegisterForm({ name: "", email: "", password: "" });
        toast.success("Account created successfully");

        // Redirect to login page
        navigate("/login");
      } catch (error) {
        // Handle any errors that occur during registration
        console.error("Registration error:", error);
        toast.error("Failed to create account. Please try again.");
      }
    };

    startTransition(() => {
      registerUser();
    });
  };

  const handleRegisterChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex justify-center px-4  sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create your account
          </CardTitle>
          <CardDescription className="text-center">
            Fill in the information below to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-name">name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="register-name"
                  name="name"
                  type="text"
                  className={`pl-9 ${errors.name ? "border-red-500" : ""}`}
                  placeholder="johndoe"
                  value={registerForm.name}
                  onChange={handleRegisterChange}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="register-email"
                  name="email"
                  type="email"
                  className={`pl-9 ${errors.email ? "border-red-500" : ""}`}
                  placeholder="name@example.com"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="register-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={`pl-9 ${errors.password ? "border-red-500" : ""}`}
                  placeholder="••••••••"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
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
              {isPending ? "Loading..." : "Create account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <Link to="/login">
            <Button variant="link" className="w-full">
              Already have an account? Sign in
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
