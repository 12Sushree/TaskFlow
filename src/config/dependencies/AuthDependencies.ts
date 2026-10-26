import { AuthRemoteDataSource } from "@/features/auth/data/datasources/AuthRemoteDataSource";
import { AuthRepositoryImpl } from "@/features/auth/data/repositories/AuthRepositoryImpl";

import { Login } from "@/features/auth/domain/usecases/Login";
import { Signup } from "@/features/auth/domain/usecases/Signup";

const authRemoteDataSource =
  new AuthRemoteDataSource();

const authRepository =
  new AuthRepositoryImpl(
    authRemoteDataSource
  );

export const login =
  new Login(authRepository);

export const signup =
  new Signup(authRepository);
