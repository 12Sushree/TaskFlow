import type { User } from "@/features/auth/domain/entities/User";
import type { UserRepository } from "@/features/user/domain/repositories/UserRepository";
import { UserRemoteDataSource } from "../datasources/UserRemoteDataSource";

export class UserRepositoryImpl implements UserRepository {
  private readonly dataSource: UserRemoteDataSource;

  constructor(dataSource: UserRemoteDataSource) {
    this.dataSource = dataSource;
  }

  async getUsers() {
    return this.dataSource.getUsers();
  }
}
