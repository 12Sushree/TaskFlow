import type { AuthRepository } from "@/features/auth/domain/repositories/AuthRepository";

export class Login {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(
    email: string,
    password: string
  ) {
    if (!email.trim()) {
      throw new Error("Email is required.");
    }

    if (!password.trim()) {
      throw new Error("Password is required.");
    }

    return this.authRepository.login(
      email.trim(),
      password
    );
  }
}