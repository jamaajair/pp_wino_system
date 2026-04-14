import api from "../api/axios";

export interface AuthResponse {
  id: number;
  username: string;
  role: string;
  token: string;
}

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/login", { username, password });
  localStorage.setItem("wino-token", response.data.token);
  localStorage.setItem("wino-user", JSON.stringify(response.data));
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("wino-token");
  localStorage.removeItem("wino-user");
};

export const getStoredUser = (): AuthResponse | null => {
  const raw = localStorage.getItem("wino-user");
  return raw ? JSON.parse(raw) : null;
};
