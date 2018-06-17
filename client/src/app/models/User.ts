import { ChatMessage } from "./ChatMessage";

export interface User {
  id:string
  name: string
  status: UserStatus
  messages: ChatMessage[]
  unreadMessages: number
}

export enum UserStatus {
  Disconnected,
  Connected
}

export function NewUser(id: string, name: string) {
  return { id, name, messages: [], status: UserStatus.Connected, unreadMessages: 0 }
}