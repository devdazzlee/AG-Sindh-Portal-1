"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Activity, AlertCircle, CheckCircle, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockLetters = [
  {
    letterId: "LTR001",
    date: "2024-04-11",
    time: "14:30:25",
    receivedAt: "2024-04-11T14:30:25",
    receivedBy: "RD Admin",
    status: "Received",
  },
  {
    letterId: "LTR002",
    date: "2024-04-11",
    time: "14:25:10",
    status: "Pending",
  },
]

export function SystemLogs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    // Generate logs based on stored letters
    const storedLetters = mockLetters
    const generatedLogs = storedLetters.flatMap((letter: any) => [
      {
        id: `${letter.letterId}-1`,
        timestamp: `${letter.date} ${letter.time}`,
        action: "Letter Scanned",
        user: "RD Admin",
        details: `Letter ${letter.letterId} scanned and processed`,
        type: "info",
        letterId: letter.letterId,
      },
      {
        id: `${letter.letterId}-2`,
        timestamp: `${letter.date} ${letter.time}`,
        action: "QR Code Generated",
        user: "RD Admin",
        details: `QR code generated for letter ${letter.letterId}`,
        type: "success",
        letterId: letter.letterId,
      },
      ...(letter.status === "Received"
        ? [
            {
              id: `${letter.letterId}-3`,
              timestamp: letter.receivedAt?.split("T")[0] || letter.date,
              action: "Status Updated",
              user: letter.receivedBy || "Department User",
              details: `Letter ${letter.letterId} marked as received`,
              type: "success",
              letterId: letter.letterId,
            },
          ]
        : []),
    ])

    // Add some system logs
    const systemLogs = [
      {
        id: "sys-1",
        timestamp: new Date().toISOString().split("T")[0] + " 09:00:00",
        action: "System Startup",
        user: "System",
        details: "Letter Management System started successfully",
        type: "info",
        letterId: null,
      },
      {
        id: "sys-2",
        timestamp: new Date().toISOString().split("T")[0] + " 08:30:00",
        action: "Database Backup",
        user: "System",
        details: "Daily database backup completed",
        type: "success",
        letterId: null,
      },
    ]

    setLogs(
      [...generatedLogs, ...systemLogs].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      ),
    )
  }, [])

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.letterId && log.letterId.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = filterType === "all" || log.type === filterType

    return matchesSearch && matchesType
  })

  const getLogIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  const getLogBadgeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
      </div>

      {/* Stats */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Activities</p>
                  <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success</p>
                  <p className="text-2xl font-bold text-green-600">{logs.filter((l) => l.type === "success").length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Warnings</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {logs.filter((l) => l.type === "warning").length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Info</p>
                  <p className="text-2xl font-bold text-blue-600">{logs.filter((l) => l.type === "info").length}</p>
                </div>
                <Info className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Timestamp</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Details</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Letter ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm || filterType !== "all"
                      ? "No logs found matching your criteria"
                      : "No system logs available"}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">{log.timestamp}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.action}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{log.user}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{log.details}</td>
                    <td className="px-6 py-4 text-sm">
                      {log.letterId ? (
                        <Badge variant="outline">{log.letterId}</Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center space-x-2">
                        {getLogIcon(log.type)}
                        <Badge className={getLogBadgeColor(log.type)}>{log.type}</Badge>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
