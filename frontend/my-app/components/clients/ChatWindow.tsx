'use client'

import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import { Loader2, Send, X } from 'lucide-react'

interface ChatWindowProps {
  onClose: () => void
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  message: string
  createdAt: string
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnecting, setIsConnecting] = useState(true)
  const [isFetching, setIsFetching] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null

  

  // Fetch old messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId) return

      try {
        const response = await fetch(`http://localhost:3100/messages?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch messages')
        }

        const data = await response.json()
        setMessages(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load message history.",
          variant: "destructive",
        })
      } finally {
        setIsFetching(false)
      }
    }

    fetchMessages()
  }, [userId])

  // Initialize socket connection
  useEffect(() => {
    if (!userId) return

    const socketInstance = io('http://localhost:3100', {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('token')
      }
    })

    socketInstance.on('connect', () => {
      setIsConnecting(false)
      socketInstance.emit('join', { role: 'customer', userId })
    })

    socketInstance.on('connect_error', () => {
      setIsConnecting(false)
      toast({
        title: "Connection Error",
        description: "Failed to connect to chat server.",
        variant: "destructive",
      })
    })

    socketInstance.on('receiveMessage', (newMessage: Message) => {
      setMessages(prev => [...prev, newMessage])
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [userId])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!socket || !newMessage.trim() || !userId) return

    try {
      const messageData = {
        customerId: userId,
        message: newMessage.trim()
      }

      socket.emit('sendMessageToAdmin', messageData)
      
      // Optimistically add message to UI
      const optimisticMessage: Message = {
        id: Date.now().toString(),
        senderId: userId,
        receiverId: 'admin',
        message: newMessage.trim(),
        createdAt: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, optimisticMessage])
      setNewMessage('')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!userId) {
    return (
      <Card className="w-[350px] shadow-lg">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="text-sm mb-4">Please log in to use the chat feature</p>
          <Button onClick={() => window.location.href = '/auth'}>
            Log In
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-[350px] shadow-lg">
      <CardHeader className="p-4">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            Chat Support
            {(isConnecting || isFetching) && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col h-[400px]">
          <ScrollArea className="flex-1" ref={scrollAreaRef}>
            {messages.length === 0 && !isFetching ? (
              <div className="flex items-center justify-center h-full text-sm text-gray-500">
                Start a conversation with us!
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.senderId === userId
                          ? 'bg-[#6B9080] text-white'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isConnecting}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isConnecting || !newMessage.trim()}
              className="bg-[#6B9080] hover:bg-[#5f8172]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}

