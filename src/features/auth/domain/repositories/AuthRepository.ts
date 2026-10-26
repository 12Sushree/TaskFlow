import type { User } from "@/features/auth/domain/entities/User";

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthRepository {
  signup(user: User): Promise<AuthResponse>;

  login(email: string, password: string): Promise<AuthResponse>;
}
