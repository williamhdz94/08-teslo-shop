import { User } from "./IUser";

export interface AuthResponse {
  user: User,
  token: string
}
