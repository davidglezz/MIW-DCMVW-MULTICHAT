
export type ChatMessage = NotifyMessage | TextMessage;

export interface TextMessage {
  type: 'text'
  name: string
  text: string
}

export interface NotifyMessage {
  type: 'notify'
  text: string
}
