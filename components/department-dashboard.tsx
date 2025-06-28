"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Sidebar } from "@/components/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Eye, CheckCircle, Loader2, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function DepartmentDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("assigned-letters")
  const [searchTerm, setSearchTerm] = useState("")
  const [letters, setLetters] = useState<any[]>([])
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({})
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadLetters()
  }, [user?.department])

  const loadLetters = () => {
    // Load letters assigned to this department
    const storedLetters = JSON.parse(localStorage.getItem("letters") || "[]")
    const departmentLetters = storedLetters.filter((letter: any) => letter.department === user?.department)
    setLetters(departmentLetters)
  }

  const getFilteredLetters = () => {
    let filtered = letters

    // Filter by tab
    if (activeTab === "received-letters") {
      filtered = filtered.filter((letter) => letter.status === "Received")
    } else if (activeTab === "assigned-letters") {
      filtered = filtered.filter((letter) => letter.status !== "Received")
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (letter) =>
          letter.letterId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          letter.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          letter.to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          letter.subject?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((letter) => letter.status === statusFilter)
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((letter) => letter.priority === priorityFilter)
    }

    // Apply date filter
    if (dateFilter) {
      filtered = filtered.filter((letter) => letter.date === dateFilter)
    }

    return filtered
  }

  const handleMarkReceived = async (letterId: string) => {
    setLoadingStates((prev) => ({ ...prev, [letterId]: true }))

    // Simulate API call delay
    setTimeout(() => {
      // Update letter status in localStorage
      const storedLetters = JSON.parse(localStorage.getItem("letters") || "[]")
      const updatedLetters = storedLetters.map((letter: any) =>
        letter.letterId === letterId
          ? {
              ...letter,
              status: "Received",
              receivedBy: user?.name,
              receivedAt: new Date().toISOString(),
              departmentReceivedDate: new Date().toISOString().split("T")[0],
              departmentReceivedTime: new Date().toTimeString().split(" ")[0].slice(0, 5),
            }
          : letter,
      )
      localStorage.setItem("letters", JSON.stringify(updatedLetters))

      // Update local state
      setLetters(
        letters.map((letter) =>
          letter.letterId === letterId
            ? {
                ...letter,
                status: "Received",
                receivedBy: user?.name,
                receivedAt: new Date().toISOString(),
                departmentReceivedDate: new Date().toISOString().split("T")[0],
                departmentReceivedTime: new Date().toTimeString().split(" ")[0].slice(0, 5),
              }
            : letter,
        ),
      )

      setLoadingStates((prev) => ({ ...prev, [letterId]: false }))

      toast({
        title: "Letter Marked as Received",
        description: `Letter ${letterId} has been successfully marked as received by ${user?.department} department`,
      })

      // Simulate notification to RD department
      setTimeout(() => {
        toast({
          title: "RD Department Notified",
          description: `RD Department has been notified that ${letterId} was received`,
        })
      }, 1500)
    }, 2000)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setPriorityFilter("all")
    setDateFilter("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Generated":
        return "bg-blue-100 text-blue-800"
      case "Received":
        return "bg-green-100 text-green-800"
      case "In Transit":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800"
      case "Normal":
        return "bg-blue-100 text-blue-800"
      case "Low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const menuItems = [
    { id: "assigned-letters", title: "Assigned Letters", icon: "📋" },
    { id: "received-letters", title: "Received Letters", icon: "✅" },
    { id: "search", title: "Search Letters", icon: "🔍" },
  ]

  const filteredLetters = getFilteredLetters()

  const renderContent = () => {
    switch (activeTab) {
      case "assigned-letters":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Assigned Letters</h2>
            <p className="text-gray-600 mb-6">Letters waiting to be received by your department</p>
            {renderLettersTable(filteredLetters.filter((l) => l.status !== "Received"))}
          </div>
        )
      case "received-letters":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Received Letters</h2>
            <p className="text-gray-600 mb-6">Letters that have been received by your department</p>
            {renderLettersTable(filteredLetters.filter((l) => l.status === "Received"))}
          </div>
        )
      case "search":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Search Letters</h2>
            <p className="text-gray-600 mb-6">Advanced search and filtering options</p>
            {renderAdvancedSearch()}
            {renderLettersTable(filteredLetters)}
          </div>
        )
      default:
        return renderLettersTable(filteredLetters)
    }
  }

  const renderAdvancedSearch = () => (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by ID, sender, subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Generated">Generated</SelectItem>
                <SelectItem value="Received">Received</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full" />
          </div>
        </div>

        <div className="flex space-x-2">
          <Button onClick={clearFilters} variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
          <Button onClick={loadLetters} variant="outline" size="sm">
            Refresh Data
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderLettersTable = (lettersToShow: any[]) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Letter ID</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">From</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">To</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subject</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Priority</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {lettersToShow.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                {activeTab === "search" && (searchTerm || statusFilter !== "all" || priorityFilter !== "all")
                  ? "No letters found matching your search criteria"
                  : activeTab === "received-letters"
                    ? "No letters have been received yet"
                    : "No letters assigned to your department yet"}
              </td>
            </tr>
          ) : (
            lettersToShow.map((letter, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{letter.letterId}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{letter.from}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{letter.to}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{letter.subject || "No subject"}</td>
                <td className="px-6 py-4 text-sm">
                  <Badge className={getPriorityColor(letter.priority)}>{letter.priority}</Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{letter.date}</td>
                <td className="px-6 py-4 text-sm">
                  <Badge className={getStatusColor(letter.status)}>{letter.status}</Badge>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {letter.status === "Generated" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkReceived(letter.letterId)}
                        disabled={loadingStates[letter.letterId]}
                        className="text-green-600 hover:text-green-700"
                        title="Mark as Received"
                      >
                        {loadingStates[letter.letterId] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    {letter.status === "Received" && (
                      <div className="text-xs text-green-600">
                        Received by {letter.receivedBy}
                        <br />
                        {letter.departmentReceivedDate}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} menuItems={menuItems} userRole="department" />
      <div className="flex-1">
        <div className="bg-white min-h-screen">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.department} Department Portal</h1>
                <p className="text-gray-600">Manage letters assigned to your department</p>
              </div>
              <Button onClick={loadLetters} variant="outline">
                Refresh Letters
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Assigned</p>
                      <p className="text-2xl font-bold text-gray-900">{letters.length}</p>
                    </div>
                    <div className="text-2xl">📋</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {letters.filter((l) => l.status === "Generated").length}
                      </p>
                    </div>
                    <div className="text-2xl">⏳</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Received</p>
                      <p className="text-2xl font-bold text-green-600">
                        {letters.filter((l) => l.status === "Received").length}
                      </p>
                    </div>
                    <div className="text-2xl">✅</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Urgent</p>
                      <p className="text-2xl font-bold text-red-600">
                        {letters.filter((l) => l.priority === "Urgent").length}
                      </p>
                    </div>
                    <div className="text-2xl">🚨</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content based on active tab */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
