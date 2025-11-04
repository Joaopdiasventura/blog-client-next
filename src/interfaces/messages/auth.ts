import { Message } from ".";
import { User } from "../../models/user";

export interface AuthMessage extends Message {
  token: string;
  user: User;
}
