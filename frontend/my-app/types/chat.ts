export interface Message {
    id: string
    content: string
    sender: string
    timestamp: string
  }
  
  export interface ChatRoom {
    id: string
    name: string
    messages: Message[]
  }
  
  