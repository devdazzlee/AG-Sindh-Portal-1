"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  menuItems: Array<{ id: string; title: string; icon: string }>
  userRole: string
}

export function Sidebar({ activeTab, setActiveTab, menuItems, userRole }: SidebarProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getRoleTitle = (role: string) => {
    switch (role) {
      case "super-admin":
        return "Super Admin"
      case "rd-department":
        return "RD Department"
      case "department":
        return `${user?.department} Dept`
      case "courier":
        return "Courier Service"
      default:
        return "User"
    }
  }

  return (
    <div className="w-64 bg-slate-800 text-white min-h-screen">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full" />
          <div>
            <h2 className="text-lg font-semibold text-white">Accountant</h2>
            <p className="text-sm text-slate-300">General Sindh</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-sm text-slate-300">{getRoleTitle(userRole)}</p>
          <p className="text-xs text-slate-400">{user?.name}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
              activeTab === item.id
                ? "bg-slate-700 text-white border-r-2 border-white"
                : "text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <span className="text-lg mr-3">{item.icon}</span>
            <span className="text-sm font-medium">{item.title}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-slate-700">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  )
}
