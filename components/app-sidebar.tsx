"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BarChart3, Settings, Mail, Send, FileText, QrCode } from "lucide-react"
import Image from "next/image"

interface AppSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const menuItems = [
  { id: "tracking", title: "Tracking", icon: BarChart3 },
  { id: "settings", title: "Settings", icon: Settings },
  { id: "incoming", title: "Incoming", icon: Mail },
  { id: "outgoing", title: "Outgoing", icon: Send },
  { id: "logs", title: "Logs", icon: FileText },
  { id: "barcode", title: "Barcode Scan", icon: QrCode },
]

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  return (
    <Sidebar className="w-64 bg-slate-800 text-white">
      <SidebarHeader className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full" />
          <div>
            <h2 className="text-lg font-semibold text-white">Accountant</h2>
            <p className="text-sm text-slate-300">General Sindh</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => setActiveTab(item.id)}
                isActive={activeTab === item.id}
                className={`w-full justify-start text-left p-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
