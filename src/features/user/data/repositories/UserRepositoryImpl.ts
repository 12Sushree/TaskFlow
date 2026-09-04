import type { User } from "@/features/auth/domain/entities/User";

import type { UserRepository } from "@/features/users/domain/repositories/UserRepository";

import { AuthLocalDataSource } from "@/features/auth/data/datasources/AuthLocalDataSource";

export class UserRepositoryImpl implements UserRepository {
  private readonly dataSource: AuthLocalDataSource;

  constructor(dataSource: AuthLocalDataSource) {
    this.dataSource = dataSource;
  }

  async getUsers() {
    return this.dataSource.getUsers();
  }
}