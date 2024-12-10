'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  isLoggedIn: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loggedIn = document.cookie.includes('isLoggedIn=true')
    setIsLoggedIn(loggedIn)
  }, [])

  const login = async (username: string, password: string) => {
    // In a real app, you would validate credentials against a backend
    if (username === 'admin' && password === 'password') {
      document.cookie = 'isLoggedIn=true; path=/'
      setIsLoggedIn(true)
      router.push('/admin')
      return true
    }
    return false
  }

  const logout = () => {
    document.cookie = 'isLoggedIn=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    setIsLoggedIn(false)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

