import type { AuthRepository, AuthResponse } from "@/features/auth/domain/repositories/AuthRepository";
import type { User } from "@/features/auth/domain/entities/User";
import { AuthRemoteDataSource } from "../datasources/AuthRemoteDataSource";

export class AuthRepositoryImpl implements AuthRepository {
  private readonly dataSource: AuthRemoteDataSource;

  constructor(dataSource: AuthRemoteDataSource) {
    this.dataSource = dataSource;
  }

  async signup(user: User): Promise<AuthResponse> {
    return this.dataSource.signup(user);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.dataSource.login(email, password);
  }
}
