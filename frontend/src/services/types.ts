export interface LoginResponse {
  token: string;
  user: User;
  status: boolean;
  msg: string;
}

export interface User {
  email: string;
  name: string;
}
