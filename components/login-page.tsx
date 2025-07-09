"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Loader2 } from "lucide-react"

interface LoginPageProps {
  onLogin: (role: "super_admin" | "rd_department" | "other_department") => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    role: "" as "super_admin" | "rd_department" | "other_department" | "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Hardcoded credentials
  const validCredentials = {
    super_admin: { username: "superadmin", password: "admin123" },
    rd_department: { username: "rdadmin", password: "rd123" },
    other_department: { username: "deptuser", password: "dept123" },
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (!credentials.role) {
      setError("Please select a role")
      setLoading(false)
      return
    }

    const validCred = validCredentials[credentials.role]
    if (credentials.username === validCred.username && credentials.password === validCred.password) {
      onLogin(credentials.role)
    } else {
      setError("Invalid username or password")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">Ag Sindh</span>
          </div>
          <CardTitle>Login to Dashboard</CardTitle>
          <CardDescription>Enter your credentials to access the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="role">Select Role</Label>
              <Select
                value={credentials.role}
                onValueChange={(value: any) => setCredentials({ ...credentials, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="rd_department">RD Department</SelectItem>
                  <SelectItem value="other_department">Other Department</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="Enter password"
                required
              />
            </div>

            {error && <div className="text-red-600 text-sm text-center">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Demo Credentials:</h4>
            <div className="text-xs space-y-1">
              <div>
                <strong>Super Admin:</strong> superadmin / admin123
              </div>
              <div>
                <strong>RD Department:</strong> rdadmin / rd123
              </div>
              <div>
                <strong>Other Department:</strong> deptuser / dept123
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
