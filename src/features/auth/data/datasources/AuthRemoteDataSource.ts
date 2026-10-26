import { apiService } from "@/shared/services/ApiService";
import type { User, UserRole } from "@/features/auth/domain/entities/User";
import type { AuthResponse } from "@/features/auth/domain/repositories/AuthRepository";

export class AuthRemoteDataSource {
  private mapRole(role: string): UserRole {
    return role.toLowerCase() === "admin" ? "admin" : "user";
  }

  private mapUser(data: any): User {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: this.mapRole(data.role),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiService.post<any>("/auth/login", {
      email,
      password,
    });

    return {
      user: this.mapUser(response.user),
      token: response.token,
    };
  }

  async signup(user: User): Promise<AuthResponse> {
    // The server handles role, but we can pass it if supported
    // Our server defaults to USER in registerController currently.
    // We might need to update the server if we want to allow role selection during signup.
    const response = await apiService.post<any>("/auth/register", {
      name: user.name,
      email: user.email,
      password: user.password,
    });

    // Note: server /auth/register returns { success, message, user } but NO token.
    // Usually login follows registration, or register returns token.
    // Our server doesn't return token on register. I'll handle it by returning empty token
    // or we can auto-login. For now, I'll return what's available.
    return {
      user: this.mapUser(response.user),
      token: response.token || "",
    };
  }
}
