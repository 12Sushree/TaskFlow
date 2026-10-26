import { apiService } from "@/shared/services/ApiService";
import type { User, UserRole } from "@/features/auth/domain/entities/User";

export class UserRemoteDataSource {
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

  async getUsers(): Promise<User[]> {
    const response = await apiService.get<any>("/users");
    return response.users.map((u: any) => this.mapUser(u));
  }

  async getMe(): Promise<User> {
    const response = await apiService.get<any>("/auth/me");
    return this.mapUser(response.user);
  }
}
