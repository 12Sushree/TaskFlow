import type { User } from "@/features/auth/domain/entities/User";

export interface AuthRepository {
  signup(user: User): Promise<User>;

  login(email: string, password: string): Promise<User>;
}