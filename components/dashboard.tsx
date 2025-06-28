"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { IncomingLetters } from "@/components/incoming-letters"
import { OutgoingLetters } from "@/components/outgoing-letters"
import { LetterTracking } from "@/components/letter-tracking"
import { SystemLogs } from "@/components/system-logs"
import { SettingsPanel } from "@/components/settings-panel"
import { BarcodeScanner } from "@/components/barcode-scanner"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("incoming")

  const renderContent = () => {
    switch (activeTab) {
      case "tracking":
        return <LetterTracking />
      case "settings":
        return <SettingsPanel />
      case "incoming":
        return <IncomingLetters />
      case "outgoing":
        return <OutgoingLetters />
      case "logs":
        return <SystemLogs />
      case "barcode":
        return <BarcodeScanner />
      default:
        return <IncomingLetters />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1">
        <main className="p-0">{renderContent()}</main>
      </div>
    </div>
  )
}
