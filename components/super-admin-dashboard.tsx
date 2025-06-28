"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ScanAndGenerate } from "@/components/scan-and-generate"
import { LetterTracking } from "@/components/letter-tracking"
import { LettersList } from "@/components/letters-list"
import { SystemLogs } from "@/components/system-logs"
import { SettingsPanel } from "@/components/settings-panel"
import { BarcodeScanner } from "@/components/barcode-scanner"
import { UserManagement } from "@/components/user-management"

export function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("scan-generate")

  const renderContent = () => {
    switch (activeTab) {
      case "scan-generate":
        return <ScanAndGenerate />
      case "tracking":
        return <LetterTracking />
      case "letters-list":
        return <LettersList />
      case "barcode-scanner":
        return <BarcodeScanner />
      case "user-management":
        return <UserManagement />
      case "logs":
        return <SystemLogs />
      case "settings":
        return <SettingsPanel />
      default:
        return <ScanAndGenerate />
    }
  }

  const menuItems = [
    { id: "scan-generate", title: "Scan & Generate", icon: "📄" },
    { id: "tracking", title: "Letter Tracking", icon: "📍" },
    { id: "letters-list", title: "All Letters", icon: "📋" },
    { id: "barcode-scanner", title: "QR Scanner", icon: "📱" },
    { id: "user-management", title: "User Management", icon: "👥" },
    { id: "logs", title: "System Logs", icon: "📝" },
    { id: "settings", title: "Settings", icon: "⚙️" },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} menuItems={menuItems} userRole="super-admin" />
      <div className="flex-1">
        <main className="p-0">{renderContent()}</main>
      </div>
    </div>
  )
}
