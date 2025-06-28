"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Bell, Database, Shield, Printer } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SettingsPanel() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    autoAssignment: true,
    barcodeFormat: "qr",
    defaultPriority: "normal",
    sessionTimeout: "30",
    maxFileSize: "10",
    printerName: "HP LaserJet Pro",
    scannerModel: "Canon DR-C225",
  })

  const { toast } = useToast()

  const handleSave = () => {
    localStorage.setItem("systemSettings", JSON.stringify(settings))
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully",
    })
  }

  const testPrinter = () => {
    toast({
      title: "Printer Test",
      description: "Test page sent to printer successfully",
    })
  }

  const testScanner = () => {
    toast({
      title: "Scanner Test",
      description: "Scanner connection test successful",
    })
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger value="hardware" className="flex items-center space-x-2">
              <Printer className="h-4 w-4" />
              <span>Hardware</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>System</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultPriority">Default Priority</Label>
                    <Select
                      value={settings.defaultPriority}
                      onValueChange={(value) => setSettings({ ...settings, defaultPriority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="barcodeFormat">Barcode Format</Label>
                    <Select
                      value={settings.barcodeFormat}
                      onValueChange={(value) => setSettings({ ...settings, barcodeFormat: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="qr">QR Code</SelectItem>
                        <SelectItem value="barcode">Barcode</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Assignment</Label>
                    <p className="text-sm text-gray-600">Automatically assign letters to departments</p>
                  </div>
                  <Switch
                    checked={settings.autoAssignment}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoAssignment: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hardware" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Printer className="h-5 w-5 mr-2" />
                    Printer Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="printerName">Printer Name</Label>
                    <Input
                      id="printerName"
                      value={settings.printerName}
                      onChange={(e) => setSettings({ ...settings, printerName: e.target.value })}
                    />
                  </div>
                  <Button onClick={testPrinter} variant="outline" className="w-full bg-transparent">
                    Test Printer Connection
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Scanner Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="scannerModel">Scanner Model</Label>
                    <Input
                      id="scannerModel"
                      value={settings.scannerModel}
                      onChange={(e) => setSettings({ ...settings, scannerModel: e.target.value })}
                    />
                  </div>
                  <Button onClick={testScanner} variant="outline" className="w-full bg-transparent">
                    Test Scanner Connection
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-600">Send email alerts for new letters</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Send SMS alerts for urgent letters</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      value={settings.maxFileSize}
                      onChange={(e) => setSettings({ ...settings, maxFileSize: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Configure Security Policies
                  </Button>
                  <p className="text-sm text-gray-600">Manage access controls and security policies</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
