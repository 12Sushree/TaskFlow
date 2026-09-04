import type { User } from "@/features/auth/domain/entities/User";
import type { AuthRepository } from "@/features/auth/domain/repositories/AuthRepository";
import * as Crypto from "expo-crypto";

export class Signup {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    role: User["role"]
  ) {
    if (!name.trim()) {
      throw new Error("Name is required.");
    }

    if (!email.trim()) {
      throw new Error("Email is required.");
    }

    if (!password.trim()) {
      throw new Error("Password is required.");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    const user: User = {
      id: Crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role,
      createdAt: new Date().toISOString(),
    };

    return this.authRepository.signup(user);
  }
}