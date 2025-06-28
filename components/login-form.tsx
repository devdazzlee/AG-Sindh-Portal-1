"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()

  // Validation function to check if form is valid
  const isFormValid = () => {
    return userType && email.trim() && password.trim()
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Additional validation before submission
    if (!isFormValid()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const success = await login(email, password, userType)
      if (success) {
        toast({
          title: "Login Successful",
          description: `Welcome to ${userType} portal`,
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An error occurred",
        variant: "destructive",
      })
      setIsLoading(false)
    }
    // finally {
    //   setIsLoading(false)
    // }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl">
      <CardHeader className="text-center space-y-4 bg-slate-50">
        <div className="flex justify-center">
          <Image src="/logo.png" alt="Accountant General Sindh" width={80} height={80} className="rounded-full" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold text-slate-800">Letter Management System</CardTitle>
          <CardDescription className="text-slate-600">Accountant General Sindh</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userType">User Type</Label>
            <Select value={userType} onValueChange={setUserType}>
              <SelectTrigger>
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="super-admin">Super Admin</SelectItem>
                <SelectItem value="rd-department">RD Department</SelectItem>
                <SelectItem value="department">Department User</SelectItem>
                <SelectItem value="courier">Courier Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
            <p>
              <strong>Demo Credentials:</strong>
            </p>
            <p>Super Admin: admin@sindh.gov.pk / 123456</p>
            <p>RD Dept: rd@sindh.gov.pk / 123456</p>
            <p>Department: finance@sindh.gov.pk / 123456</p>
            <p>Courier: courier@tcs.com / 123456</p>
          </div>

          <Button
            type="submit"
            className="w-full bg-slate-700 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
