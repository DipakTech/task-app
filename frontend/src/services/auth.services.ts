import { axiosInstance } from "./base/axiosBaseInstance";
import { LoginResponse } from "./types";

class AuthService {
  async login(user: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post(
        `/auth/login`,
        {
          ...user,
        },
        { withCredentials: true },
      );
      return response.data;
    } catch (error: unknown) {
      console.log(error);
      throw new Error("Failed to login");
    }
  }

  async register(user: {
    name: string;
    email: string;
    password: string;
  }): Promise<{
    msg: string;
  }> {
    try {
      const response = await axiosInstance.post(`/auth/register`, {
        ...user,
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to register");
    }
  }

  async logout(): Promise<void> {
    try {
      await axiosInstance.post(`/auth/logout`);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to logout");
    }
  }
}

const auth = new AuthService();
export default auth;
