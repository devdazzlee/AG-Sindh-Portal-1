"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, QrCode, BarChart3, TrendingUp, AlertTriangle, MapPin, Clock, CheckCircle, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function LetterTracking() {
  const [searchTerm, setSearchTerm] = useState("")
  const [trackingResult, setTrackingResult] = useState<any>(null)
  const [letters, setLetters] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    loadLetters()
    loadRecentSearches()
  }, [])

  const loadLetters = () => {
    const storedLetters = JSON.parse(localStorage.getItem("letters") || "[]")
    setLetters(storedLetters)
  }

  const loadRecentSearches = () => {
    const searches = JSON.parse(localStorage.getItem("recentSearches") || "[]")
    setRecentSearches(searches.slice(0, 5)) // Keep only last 5 searches
  }

  const saveRecentSearch = (searchTerm: string) => {
    const searches = JSON.parse(localStorage.getItem("recentSearches") || "[]")
    const updatedSearches = [searchTerm, ...searches.filter((s) => s !== searchTerm)].slice(0, 5)
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
    setRecentSearches(updatedSearches)
  }

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a Letter ID or sender name to search",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)
    setTrackingResult(null)

    // Simulate API call delay
    setTimeout(() => {
      const foundLetter = letters.find(
        (letter) =>
          letter.letterId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          letter.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          letter.to?.toLowerCase().includes(searchTerm.toLowerCase()),
      )

      if (foundLetter) {
        // Generate comprehensive tracking timeline
        const timeline = generateTimeline(foundLetter)

        const trackingData = {
          ...foundLetter,
          currentLocation: getCurrentLocation(foundLetter.status, foundLetter.department),
          progress: getProgress(foundLetter.status),
          timeline: timeline,
          estimatedDelivery: getEstimatedDelivery(foundLetter),
          lastUpdate: new Date().toISOString(),
        }

        setTrackingResult(trackingData)
        saveRecentSearch(searchTerm)

        toast({
          title: "Letter Found",
          description: `Successfully found letter ${foundLetter.letterId}`,
        })
      } else {
        setTrackingResult(null)
        toast({
          title: "Letter Not Found",
          description: `No letter found matching "${searchTerm}"`,
          variant: "destructive",
        })
      }
      setIsSearching(false)
    }, 2000)
  }

  const generateTimeline = (letter: any) => {
    const baseDate = new Date(letter.createdAt || letter.date + "T" + (letter.time || "10:00:00"))

    const timeline = [
      {
        step: "Letter Received",
        date: formatDateTime(baseDate),
        completed: true,
        location: "RD Department - Reception",
        description: "Letter received and logged into system",
      },
      {
        step: "Document Scanned",
        date: formatDateTime(new Date(baseDate.getTime() + 5 * 60000)), // +5 minutes
        completed: true,
        location: "RD Department - Scanning Station",
        description: "Document digitized and stored",
      },
      {
        step: "QR Code Generated",
        date: formatDateTime(new Date(baseDate.getTime() + 10 * 60000)), // +10 minutes
        completed: true,
        location: "RD Department - Processing",
        description: "Unique QR code generated and attached",
      },
    ]

    // Add status-specific timeline entries
    if (letter.status !== "Generated") {
      timeline.push({
        step: "Assigned to Department",
        date: formatDateTime(new Date(baseDate.getTime() + 30 * 60000)), // +30 minutes
        completed: true,
        location: `${letter.department} Department`,
        description: `Letter assigned to ${letter.department} department`,
      })
    }

    if (letter.status === "Received") {
      timeline.push({
        step: "Received by Department",
        date: letter.receivedAt ? formatDateTime(new Date(letter.receivedAt)) : "Pending",
        completed: true,
        location: `${letter.department} Department`,
        description: `Received by ${letter.receivedBy || "Department Staff"}`,
      })
    } else if (letter.status === "Generated") {
      timeline.push({
        step: "Awaiting Department Pickup",
        date: "Pending",
        completed: false,
        location: "RD Department",
        description: "Waiting for department to receive letter",
      })
    }

    return timeline
  }

  const getCurrentLocation = (status: string, department: string) => {
    switch (status) {
      case "Generated":
        return "RD Department - Ready for Pickup"
      case "Received":
        return `${department} Department - Received`
      case "In Transit":
        return "En Route to Department"
      case "Delivered":
        return `${department} Department - Delivered`
      default:
        return "RD Department"
    }
  }

  const getProgress = (status: string) => {
    switch (status) {
      case "Generated":
        return 60
      case "In Transit":
        return 80
      case "Received":
      case "Delivered":
        return 100
      default:
        return 25
    }
  }

  const getEstimatedDelivery = (letter: any) => {
    const baseDate = new Date(letter.createdAt || letter.date + "T10:00:00")
    if (letter.status === "Received" || letter.status === "Delivered") {
      return "Completed"
    }

    // Add 2 hours for normal priority, 1 hour for urgent
    const hoursToAdd = letter.priority === "Urgent" ? 1 : 2
    const estimatedDate = new Date(baseDate.getTime() + hoursToAdd * 60 * 60 * 1000)
    return formatDateTime(estimatedDate)
  }

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getFilteredLetters = () => {
    let filtered = letters

    if (filterStatus !== "all") {
      filtered = filtered.filter((letter) => letter.status === filterStatus)
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter((letter) => letter.priority === filterPriority)
    }

    return filtered
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

  const filteredLetters = getFilteredLetters()

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Letter Tracking</h1>
        <p className="text-gray-600">Track letters in real-time with detailed status updates</p>
      </div>

      {/* Content */}
      <div className="px-8 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Processed</p>
                  <p className="text-2xl font-bold text-gray-900">{letters.length}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />+{Math.floor(letters.length * 0.12)} from last month
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Processing Time</p>
                  <p className="text-2xl font-bold text-gray-900">2.4 hrs</p>
                  <p className="text-xs text-green-600">Within SLA</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Letters</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {letters.filter((l) => l.status === "Generated").length}
                  </p>
                  <p className="text-xs text-yellow-600">Awaiting pickup</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-green-600">98.7%</p>
                  <p className="text-xs text-green-600">Excellent</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Track Letter Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="h-5 w-5 mr-2" />
              Track Letter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Enter Letter ID, sender name, or recipient name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700" disabled={isSearching}>
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4 mr-2" />
                    Track
                  </>
                )}
              </Button>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Recent Searches:</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm(search)
                        handleSearch()
                      }}
                      className="text-xs"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Tracking Result */}
            {trackingResult && (
              <div className="mt-6 p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-green-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Letter ID: {trackingResult.letterId}</h3>
                  <Badge className={getStatusColor(trackingResult.status)}>{trackingResult.status}</Badge>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{trackingResult.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${trackingResult.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Letter Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm font-medium text-gray-600">From</p>
                    <p className="text-sm text-gray-900">{trackingResult.from}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">To</p>
                    <p className="text-sm text-gray-900">{trackingResult.to}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Department</p>
                    <p className="text-sm text-gray-900">{trackingResult.department}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Priority</p>
                    <Badge className={getPriorityColor(trackingResult.priority)}>{trackingResult.priority}</Badge>
                  </div>
                </div>

                {/* Current Location */}
                <div className="mb-6 p-4 bg-white rounded-lg border">
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="font-medium">Current Location</span>
                  </div>
                  <p className="text-gray-900">{trackingResult.currentLocation}</p>
                  <p className="text-sm text-gray-600">
                    Last updated: {formatDateTime(new Date(trackingResult.lastUpdate))}
                  </p>
                  {trackingResult.estimatedDelivery !== "Completed" && (
                    <p className="text-sm text-blue-600">Estimated completion: {trackingResult.estimatedDelivery}</p>
                  )}
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Tracking Timeline
                  </h4>
                  <div className="space-y-4">
                    {trackingResult.timeline.map((item: any, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full mt-1 ${item.completed ? "bg-green-500" : "bg-gray-300"}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${item.completed ? "text-gray-900" : "text-gray-500"}`}>
                              {item.step}
                            </p>
                            <span className="text-xs text-gray-500">{item.date}</span>
                          </div>
                          <p className="text-xs text-gray-600">{item.location}</p>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {searchTerm && !trackingResult && !isSearching && (
              <div className="mt-6 p-6 border rounded-lg bg-red-50">
                <p className="text-red-800">No letter found with search term: "{searchTerm}"</p>
                <p className="text-sm text-red-600 mt-1">
                  Please check the Letter ID or try searching by sender/recipient name
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Letters Overview */}
        <Card>
          <CardHeader>
            <CardTitle>All Letters Overview</CardTitle>
            <div className="flex space-x-4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Generated">Generated</SelectItem>
                  <SelectItem value="Received">Received</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Letter ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">From</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">To</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Priority</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLetters.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        {filterStatus !== "all" || filterPriority !== "all"
                          ? "No letters found matching the selected filters"
                          : "No letters available"}
                      </td>
                    </tr>
                  ) : (
                    filteredLetters.map((letter, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{letter.letterId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{letter.from}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{letter.to}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{letter.department}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge className={getPriorityColor(letter.priority)}>{letter.priority}</Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Badge className={getStatusColor(letter.status)}>{letter.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{letter.date}</td>
                        <td className="px-4 py-3 text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSearchTerm(letter.letterId)
                              handleSearch()
                            }}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Track
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
