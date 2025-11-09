import { api } from './api';
import type { AuthResponse, LoginCredentials, RegisterCredentials, ProtectedResponse } from '../types';

export const authService = {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/register', credentials);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      console.log('Token stored after registration:', response.data.access_token); // Debug
    }
    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      console.log('Token stored after login:', response.data.access_token); // Debug
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
  },

  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('Retrieved token:', token); // Debug
    return token;
  },

  isAuthenticated(): boolean {
    const authenticated = !!localStorage.getItem('token');
    console.log('Is authenticated:', authenticated); // Debug
    return authenticated;
  },

  async checkProtected(): Promise<ProtectedResponse> {
    console.log('Making protected request...'); // Debug
    const response = await api.get<ProtectedResponse>('/protected');
    return response.data;
  }
};