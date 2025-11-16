export interface User {
  id: string
  name: string
  password: string
  email: string
  isAdmin: boolean
  createdAt: string
  updatedAt: string
}

export interface UserRequest {
  name: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: "ROLE_USER" | "ROLE_ADMIN";
  createdAt: string;
  updatedAt: string;
}