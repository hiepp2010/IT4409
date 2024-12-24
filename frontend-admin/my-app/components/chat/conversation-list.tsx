import { User } from "@/types/chat"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ConversationListProps {
  users: User[]
  selectedUserId?: string
  onSelectUser: (userId: string) => void
}

export function ConversationList({ users, selectedUserId, onSelectUser }: ConversationListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="space-y-2 p-2">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user.id)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors",
              selectedUserId === user.id && "bg-accent"
            )}
          >
            <div className="relative">
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
                  user.status === "online" ? "bg-green-500" : "bg-gray-400"
                )}
              />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">{user.name}</div>
              {user.status === "offline" && user.lastSeen && (
                <div className="text-xs text-muted-foreground">
                  Last seen: {new Date(user.lastSeen).toLocaleString()}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}

