"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Edit, Trash2, Download, Filter, RefreshCw, Calendar, User, Building } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function LettersList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [letters, setLetters] = useState<any[]>([])
  const [filteredLetters, setFilteredLetters] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadLetters()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [letters, searchTerm, statusFilter, priorityFilter, departmentFilter, dateFilter, sortBy, sortOrder])

  const loadLetters = () => {
    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      const storedLetters = JSON.parse(localStorage.getItem("letters") || "[]")

      // Add some sample data if no letters exist
      if (storedLetters.length === 0) {
        const sampleLetters = [
          {
            letterId: "LTR001234",
            from: "Ahmed Ali",
            to: "Finance Officer",
            department: "Finance",
            priority: "Urgent",
            subject: "Budget Approval Request",
            description: "Request for Q2 budget approval",
            date: "2024-04-11",
            time: "10:30",
            status: "Generated",
            createdAt: "2024-04-11T10:30:00Z",
            createdBy: "RD Department",
          },
          {
            letterId: "LTR001235",
            from: "Sarah Khan",
            to: "Education Officer",
            department: "Education",
            priority: "Normal",
            subject: "School Infrastructure Report",
            description: "Annual infrastructure assessment",
            date: "2024-04-10",
            time: "14:15",
            status: "Received",
            createdAt: "2024-04-10T14:15:00Z",
            createdBy: "RD Department",
            receivedBy: "Education Officer",
            receivedAt: "2024-04-11T09:00:00Z",
          },
          {
            letterId: "LTR001236",
            from: "Dr. Hassan",
            to: "Health Officer",
            department: "Health",
            priority: "Urgent",
            subject: "Medical Equipment Purchase",
            description: "Emergency medical equipment procurement",
            date: "2024-04-09",
            time: "16:45",
            status: "Delivered",
            createdAt: "2024-04-09T16:45:00Z",
            createdBy: "RD Department",
          },
        ]
        localStorage.setItem("letters", JSON.stringify(sampleLetters))
        setLetters(sampleLetters)
      } else {
        setLetters(storedLetters)
      }

      setIsLoading(false)
    }, 1000)
  }

  const applyFilters = () => {
    let filtered = [...letters]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (letter) =>
          letter.letterId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          letter.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          letter.to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          letter.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          letter.subject?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((letter) => letter.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((letter) => letter.priority === priorityFilter)
    }

    // Department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter((letter) => letter.department === departmentFilter)
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter((letter) => letter.date === dateFilter)
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case "date":
          aValue = new Date(a.createdAt || a.date).getTime()
          bValue = new Date(b.createdAt || b.date).getTime()
          break
        case "priority":
          const priorityOrder = { Urgent: 3, Normal: 2, Low: 1 }
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        case "letterId":
          aValue = a.letterId
          bValue = b.letterId
          break
        default:
          aValue = a.letterId
          bValue = b.letterId
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredLetters(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setPriorityFilter("all")
    setDepartmentFilter("all")
    setDateFilter("")
    setSortBy("date")
    setSortOrder("desc")

    toast({
      title: "Filters Cleared",
      description: "All filters have been reset",
    })
  }

  const exportToCSV = () => {
    const headers = ["Letter ID", "From", "To", "Department", "Priority", "Status", "Date", "Subject"]
    const csvContent = [
      headers.join(","),
      ...filteredLetters.map((letter) =>
        [
          letter.letterId,
          letter.from,
          letter.to,
          letter.department,
          letter.priority,
          letter.status,
          letter.date,
          `"${letter.subject || ""}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `letters-export-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Successful",
      description: "Letters data has been exported to CSV",
    })
  }

  const deleteLetter = (letterId: string) => {
    const updatedLetters = letters.filter((letter) => letter.letterId !== letterId)
    setLetters(updatedLetters)
    localStorage.setItem("letters", JSON.stringify(updatedLetters))

    toast({
      title: "Letter Deleted",
      description: `Letter ${letterId} has been deleted`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Generated":
        return "bg-blue-100 text-blue-800"
      case "Received":
        return "bg-green-100 text-green-800"
      case "In Transit":
        return "bg-yellow-100 text-yellow-800"
      case "Delivered":
        return "bg-green-100 text-green-800"
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

  const getUniqueValues = (field: string) => {
    return [...new Set(letters.map((letter) => letter[field]).filter(Boolean))]
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Letters</h1>
            <p className="text-gray-600">
              Total: {filteredLetters.length} of {letters.length} letters
              {searchTerm ||
              statusFilter !== "all" ||
              priorityFilter !== "all" ||
              departmentFilter !== "all" ||
              dateFilter
                ? " (filtered)"
                : ""}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={loadLetters} variant="outline" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Letters</p>
                  <p className="text-2xl font-bold text-gray-900">{letters.length}</p>
                </div>
                <div className="text-2xl">📄</div>
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
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {letters.filter((l) => l.status === "Received" || l.status === "Delivered").length}
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

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search letters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
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

              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
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

              <div>
                <label className="text-sm font-medium mb-2 block">Department</label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {getUniqueValues("department").map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Date</label>
                <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Sort by:</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="letterId">Letter ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Order:</label>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Newest First</SelectItem>
                      <SelectItem value="asc">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={clearFilters} variant="outline" size="sm">
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Letters Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading letters...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Letter ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        From
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        To
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        Department
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Priority</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Date
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subject</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLetters.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                        {searchTerm ||
                        statusFilter !== "all" ||
                        priorityFilter !== "all" ||
                        departmentFilter !== "all" ||
                        dateFilter
                          ? "No letters found matching your search criteria"
                          : "No letters available"}
                      </td>
                    </tr>
                  ) : (
                    filteredLetters.map((letter, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{letter.letterId}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{letter.from}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{letter.to}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{letter.department}</td>
                        <td className="px-6 py-4 text-sm">
                          <Badge className={getPriorityColor(letter.priority)}>{letter.priority}</Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {letter.date}
                          {letter.time && <div className="text-xs text-gray-500">{letter.time}</div>}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Badge className={getStatusColor(letter.status)}>{letter.status}</Badge>
                          {letter.status === "Received" && letter.receivedBy && (
                            <div className="text-xs text-gray-500 mt-1">by {letter.receivedBy}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                          <div className="truncate" title={letter.subject}>
                            {letter.subject || "No subject"}
                          </div>
                          {letter.description && (
                            <div className="text-xs text-gray-500 truncate" title={letter.description}>
                              {letter.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" title="View Details">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Edit Letter">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteLetter(letter.letterId)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete Letter"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        {filteredLetters.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredLetters.length} of {letters.length} letters
            {(searchTerm ||
              statusFilter !== "all" ||
              priorityFilter !== "all" ||
              departmentFilter !== "all" ||
              dateFilter) && <span> (filtered)</span>}
          </div>
        )}
      </div>
    </div>
  )
}
