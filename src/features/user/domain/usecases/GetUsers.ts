import type { UserRepository } from "@/features/users/domain/repositories/UserRepository";

export class GetUsers {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute() {
    return this.userRepository.getUsers();
  }
}