import type { User } from "@/features/auth/domain/entities/User";

export interface UserRepository {
  getUsers(): Promise<User[]>;
}