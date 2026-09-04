import { GetUsers } from "@/features/user/domain/usecases/GetUsers";

import { AuthLocalDataSource } from "@/features/auth/data/datasources/AuthLocalDataSource";

import { UserRepositoryImpl } from "@/features/user/data/repositories/UserRepositoryImpl";

const authLocalDataSource =
  new AuthLocalDataSource();

const userRepository =
  new UserRepositoryImpl(
    authLocalDataSource
  );

export const getUsers =
  new GetUsers(userRepository);