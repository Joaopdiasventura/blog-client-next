import { AuthMessage } from "../../../interfaces/messages/auth";
import { User } from "../../../models/user";
import { api } from "../client";

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

const baseUrl = "/user";

export async function create(
  createUserDto: CreateUserDto
): Promise<AuthMessage> {
  return api.post<AuthMessage>(baseUrl, createUserDto).then((res) => res.data);
}

export async function login(loginUserDto: LoginUserDto): Promise<AuthMessage> {
  return api
    .post<AuthMessage>(baseUrl + "/login", loginUserDto)
    .then((res) => res.data);
}

export async function decodeToken(token: string): Promise<User> {
  return api
    .get<User>(`${baseUrl}/decodeToken/${token}`)
    .then((res) => res.data);
}
