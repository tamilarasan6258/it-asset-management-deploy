// src/app/models/auth.model.ts

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface MessageResponse {
  message: string;
}
