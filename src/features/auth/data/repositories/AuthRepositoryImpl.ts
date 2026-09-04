import type { AuthRepository } from "@/features/auth/domain/repositories/AuthRepository";
import type { User } from "@/features/auth/domain/entities/User";

import { AuthLocalDataSource } from "@/features/auth/data/datasources/AuthLocalDataSource";

export class AuthRepositoryImpl implements AuthRepository {
  private readonly dataSource: AuthLocalDataSource;

  constructor(dataSource: AuthLocalDataSource) {
    this.dataSource = dataSource;
  }

  async signup(user: User) {
    const existingUser =
      await this.dataSource.getUserByEmail(user.email);

    if (existingUser) {
      throw new Error(
        "An account with this email already exists."
      );
    }

    return this.dataSource.createUser(user);
  }

  async login( email: string, password: string ) {
    const user =
      await this.dataSource.getUserByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    if (user.password !== password) {
      throw new Error("Invalid email or password.");
    }

    return user;
  }
}