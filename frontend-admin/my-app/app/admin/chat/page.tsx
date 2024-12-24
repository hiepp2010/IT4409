'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ConversationList } from '@/components/chat/conversation-list'
import { MessageList } from '@/components/chat/message-list'

const BACKEND_URL = 'https://maixuanhieu20215576-web.onrender.com'
const ADMIN_ID = '1' // In a real app, this would come from your auth system

interface Message {
  id: number
  senderId: string
  receiverId: string
  message: string
  createdAt: string
}

interface Customer {
  id: string
  name: string
  status: 'online' | 'offline'
}

export default function ChatPage() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>()
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Connect to the backend socket server
    const socketInstance = io(BACKEND_URL)

    socketInstance.on('connect', () => {
      setIsConnected(true)
      // Join as admin
      socketInstance.emit('join', { role: 'admin', userId: ADMIN_ID })
      toast({
        title: 'Connected to chat',
        description: 'You can now receive customer messages',
      })
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
      toast({
        title: 'Disconnected from chat',
        description: 'Attempting to reconnect...',
        variant: 'destructive',
      })
    })

    socketInstance.on('receiveMessage', ({ from, message }) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        senderId: from,
        receiverId: ADMIN_ID,
        message,
        createdAt: new Date().toISOString()
      }])
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [toast])

  // Fetch messages for selected customer
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedCustomerId) return
      
      try {
        const response = await fetch(`${BACKEND_URL}/messages?senderId=${selectedCustomerId}&receiverId=${ADMIN_ID}`)
        if (!response.ok) throw new Error('Failed to fetch messages')
        const data = await response.json()
        setMessages(data)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch messages',
          variant: 'destructive',
        })
      }
    }

    fetchMessages()
  }, [selectedCustomerId, toast])

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/customers`)
        if (!response.ok) throw new Error('Failed to fetch customers')
        const data = await response.json()
        setCustomers(data)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch customers',
          variant: 'destructive',
        })
      }
    }

    fetchCustomers()
    // Set up periodic refresh
    const interval = setInterval(fetchCustomers, 30000)
    return () => clearInterval(interval)
  }, [toast])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (messageInput.trim() && socket && selectedCustomerId) {
      // Send message to specific customer
      socket.emit('sendMessageToCustomer', {
        customerId: selectedCustomerId,
        message: messageInput.trim()
      })

      // Add message to local state
      setMessages(prev => [...prev, {
        id: Date.now(),
        senderId: ADMIN_ID,
        receiverId: selectedCustomerId,
        message: messageInput.trim(),
        createdAt: new Date().toISOString()
      }])

      setMessageInput('')
    }
  }

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-4rem)]">
      <div className="grid grid-cols-[300px_1fr] gap-4 h-full">
        <Card className="p-4">
          <ConversationList
            users={customers.map(customer => ({
              id: customer.id,
              name: customer.name,
              status: customer.status,
              avatar: `/placeholder.svg?height=40&width=40`
            }))}
            selectedUserId={selectedCustomerId}
            onSelectUser={setSelectedCustomerId}
          />
        </Card>
        
        <Card className="flex flex-col">
          {selectedCustomerId ? (
            <>
              <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isConnected ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className="font-medium">
                    {customers.find(c => c.id === selectedCustomerId)?.name || 'Customer'}
                  </span>
                </div>
              </div>

              <MessageList
                messages={messages}
                users={[
                  ...customers,
                  { id: ADMIN_ID, name: 'Admin', status: 'online' }
                ]}
                currentUserId={ADMIN_ID}
              />

              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={!isConnected}
                  />
                  <Button type="submit" disabled={!isConnected || !messageInput.trim()}>
                    Send
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a customer to start chatting
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

