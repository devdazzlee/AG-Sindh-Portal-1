"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "super-admin" | "rd-department" | "department" | "courier"
  department?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simulate authentication
    const mockUsers = {
      "admin@sindh.gov.pk": { id: "1", email, name: "Super Admin", role: "super-admin" },
      "rd@sindh.gov.pk": { id: "2", email, name: "RD Department", role: "rd-department" },
      "finance@sindh.gov.pk": { id: "3", email, name: "Finance Officer", role: "department", department: "Finance" },
      "courier@tcs.com": { id: "4", email, name: "TCS Courier", role: "courier" },
    }

    const userData = mockUsers[email as keyof typeof mockUsers]
    if (userData && password === "123456") {
      setUser(userData as User)
      localStorage.setItem("user", JSON.stringify(userData))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
