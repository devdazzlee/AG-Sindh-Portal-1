"use client"

import { useState, useEffect } from "react"
import { LoginPage } from "@/components/login-page"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Toaster } from "@/components/ui/toaster"

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<"super_admin" | "rd_department" | "other_department">("rd_department")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const savedAuth = localStorage.getItem("ag_sindh_auth")
    const savedRole = localStorage.getItem("ag_sindh_role")

    if (savedAuth === "true" && savedRole) {
      setIsAuthenticated(true)
      setUserRole(savedRole as any)
    }
    setLoading(false)
  }, [])

  const handleLogin = (role: "super_admin" | "rd_department" | "other_department") => {
    setIsAuthenticated(true)
    setUserRole(role)
    localStorage.setItem("ag_sindh_auth", "true")
    localStorage.setItem("ag_sindh_role", role)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("ag_sindh_auth")
    localStorage.removeItem("ag_sindh_role")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <DashboardLayout userRole={userRole} onLogout={handleLogout} />
      )}
      <Toaster />
    </>
  )
}
