import { NextApiRequest } from 'next'
import { NextApiResponseServerIO } from '@/lib/socket'
import { Message } from '@/types/chat'
import { initSocket } from '@/lib/socket'

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const io = initSocket(res.socket.server)
    
    io.on('connection', (socket) => {
      console.log('Client connected')

      socket.on('message', (message: Message) => {
        // In a real app, save the message to your database here
        io.emit('message', message)
      })

      socket.on('message:read', ({ messageId, userId }) => {
        // In a real app, update the message read status in your database
        io.emit('message:read', { messageId, userId })
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected')
      })
    })
  }

  res.end()
}

