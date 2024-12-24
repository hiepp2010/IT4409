import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface User {
  id: string
  name: string
  status: 'online' | 'offline'
  avatar?: string
}

interface Message {
  id: number
  senderId: string
  receiverId: string
  message: string
  createdAt: string
}

interface MessageListProps {
  messages: Message[]
  users: User[]
  currentUserId: string
}

export function MessageList({ messages, users, currentUserId }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const getUserById = (id: string) => users.find(user => user.id === id)

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div className="space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.senderId === currentUserId
          const sender = getUserById(message.senderId)

          return (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3",
                isCurrentUser && "flex-row-reverse"
              )}
            >
              <Avatar>
                <AvatarImage src={sender?.avatar} />
                <AvatarFallback>{sender?.name[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "flex flex-col",
                  isCurrentUser && "items-end"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{sender?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div
                  className={cn(
                    "rounded-lg p-3 max-w-[80%]",
                    isCurrentUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.message}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}

