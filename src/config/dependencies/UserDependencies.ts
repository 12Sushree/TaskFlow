import { UserRemoteDataSource } from "@/features/user/data/datasources/UserRemoteDataSource";
import { UserRepositoryImpl } from "@/features/user/data/repositories/UserRepositoryImpl";

import { GetUsers } from "@/features/user/domain/usecases/GetUsers";

const userRemoteDataSource =
  new UserRemoteDataSource();

const userRepository =
  new UserRepositoryImpl(
    userRemoteDataSource
  );

export const getUsers =
  new GetUsers(userRepository);
