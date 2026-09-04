import { AuthLocalDataSource } from "@/features/auth/data/datasources/AuthLocalDataSource";
import { AuthRepositoryImpl } from "@/features/auth/data/repositories/AuthRepositoryImpl";

import { Login } from "@/features/auth/domain/usecases/Login";
import { Signup } from "@/features/auth/domain/usecases/Signup";

const authLocalDataSource =
  new AuthLocalDataSource();

const authRepository =
  new AuthRepositoryImpl(
    authLocalDataSource
  );

export const login =
  new Login(authRepository);

export const signup =
  new Signup(authRepository);