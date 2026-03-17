import api from "../api/axios";

export interface AuthResponse {
  id: number;
  username: string;
  role: string;
}

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/login", { username, password });
  return response.data;
};
