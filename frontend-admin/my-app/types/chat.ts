export interface User {
    id: string
    name: string
    avatar?: string
    status: 'online' | 'offline'
    lastSeen?: string
  }
  
  export interface Message {
    id: string
    content: string
    senderId: string
    receiverId: string
    timestamp: string
    read: boolean
  }
  
  export interface Conversation {
    id: string
    participants: User[]
    lastMessage?: Message
    unreadCount: number
  }
  
  