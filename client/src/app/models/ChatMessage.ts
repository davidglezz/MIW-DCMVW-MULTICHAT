export interface ChatMessage {
  type: 'notify' | 'text'
  name: string
  text: string
}

// type ChatMessage = NotifyMessage | TextMessage;
