// src/app/models/user.model.ts

export interface User {
  
  name: string;
  email: string;
  role: 'admin' | 'depthead' | 'employee';
  department?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserResponse {
  message: string;
  user: User;
}
