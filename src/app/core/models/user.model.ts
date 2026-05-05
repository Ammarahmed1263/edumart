export interface RegisterPayload {
  userName: string;
  email: string;
  password: string;
  role?: string; // Optional, backend defaults to STUDENT
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id?: string;
  _id?: string;
  userName: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

// We add this to handle your backend's jsend format
export interface AuthResponse {
  status?: string;
  data: {
    token: string;
    user: User;
  };
}

export interface MeResponse {
  status?: string;
  data: {
    user: User;
  };
}
