'use client'

import { useState } from 'react'
import { Phone, MessageCircle, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import Link from 'next/link'
import ChatWindow from './ChatWindow'

export default function FloatingContactButtons() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 items-end z-50">
        {/* Chat Window */}
        {isChatOpen && (
          <div className="mb-2">
            <ChatWindow onClose={() => setIsChatOpen(false)} />
          </div>
        )}
        
        {/* Contact Buttons */}
        <div className="flex flex-col gap-2">
          <Link href="tel:+84123456789">
            <Button 
              size="icon" 
              className="rounded-full w-12 h-12 bg-[#6B9080] hover:bg-[#5f8172]"
            >
              <Phone className="h-6 w-6 text-white" />
            </Button>
          </Link>
          
          

          <Button 
            size="icon" 
            className="rounded-full w-12 h-12 bg-[#6B9080] hover:bg-[#5f8172]"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            {isChatOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <MessageCircle className="h-6 w-6 text-white" />
            )}
          </Button>
        </div>
      </div>
    </>
  )
}

