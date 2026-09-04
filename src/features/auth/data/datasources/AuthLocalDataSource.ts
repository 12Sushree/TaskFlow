import AsyncStorage from "@react-native-async-storage/async-storage";

import type { User } from "@/features/auth/domain/entities/User";

const USERS_STORAGE_KEY = "@taskflow/users";

export class AuthLocalDataSource {
  private async getStoredUsers() {
    const storedUsers = await AsyncStorage.getItem(
      USERS_STORAGE_KEY
    );

    if (storedUsers === null) {
      return [];
    }

    try {
      return JSON.parse(storedUsers) as User[];
    } catch {
      throw new Error("Unable to read stored users.");
    }
  }

  private async saveUsers(users: User[]) {
    await AsyncStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify(users)
    );
  }

  async getUsers(): Promise<User[]> {
    return this.getStoredUsers();
  }

  async getUserByEmail(email: string) {
    const users = await this.getStoredUsers();

    return (
      users.find(
        (user) =>
          user.email.toLowerCase() === email.toLowerCase()
      ) ?? null
    );
  }

  async createUser(user: User) {
    const users = await this.getStoredUsers();

    users.push(user);

    await this.saveUsers(users);

    return user;
  }
}