"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Sidebar } from "@/components/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Eye, Truck, MapPin, Loader2, Navigation, CheckCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function CourierDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("deliveries")
  const [searchTerm, setSearchTerm] = useState("")
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({})
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    loadDeliveries()
  }, [])

  const loadDeliveries = () => {
    // Load letters that need courier delivery
    const storedLetters = JSON.parse(localStorage.getItem("letters") || "[]")

    // Create courier deliveries from letters
    const courierDeliveries = storedLetters.map((letter: any, index: number) => ({
      trackingId: `${user?.name?.split(" ")[0]?.toUpperCase() || "TCS"}${(index + 1).toString().padStart(6, "0")}`,
      letterId: letter.letterId,
      from: "RD Department",
      to: letter.to,
      department: letter.department,
      address: `${letter.department} Department, Government of Sindh`,
      status: letter.status === "Received" ? "Delivered" : letter.status === "Generated" ? "Picked Up" : "In Transit",
      priority: letter.priority,
      pickupDate: letter.date,
      estimatedDelivery: letter.date,
      createdAt: letter.createdAt,
      currentLocation: letter.status === "Received" ? letter.department + " Department" : "En Route",
      deliveredAt: letter.status === "Received" ? letter.receivedAt : null,
    }))

    setDeliveries(courierDeliveries)
  }

  const getFilteredDeliveries = () => {
    let filtered = deliveries

    // Filter by tab
    if (activeTab === "tracking") {
      filtered = filtered.filter((delivery) => delivery.status === "In Transit" || delivery.status === "Picked Up")
    } else if (activeTab === "completed") {
      filtered = filtered.filter((delivery) => delivery.status === "Delivered")
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (delivery) =>
          delivery.trackingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          delivery.letterId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          delivery.to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          delivery.department?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((delivery) => delivery.status === statusFilter)
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((delivery) => delivery.priority === priorityFilter)
    }

    return filtered
  }

  const handleUpdateStatus = async (trackingId: string, newStatus: string) => {
    setLoadingStates((prev) => ({ ...prev, [trackingId]: true }))

    setTimeout(() => {
      // Update delivery status
      setDeliveries(
        deliveries.map((delivery) =>
          delivery.trackingId === trackingId
            ? {
                ...delivery,
                status: newStatus,
                updatedAt: new Date().toISOString(),
                currentLocation:
                  newStatus === "In Transit"
                    ? "En Route"
                    : newStatus === "Delivered"
                      ? delivery.address
                      : "Pickup Point",
                deliveredAt: newStatus === "Delivered" ? new Date().toISOString() : delivery.deliveredAt,
              }
            : delivery,
        ),
      )

      // Also update the original letter status if delivered
      if (newStatus === "Delivered") {
        const delivery = deliveries.find((d) => d.trackingId === trackingId)
        if (delivery) {
          const storedLetters = JSON.parse(localStorage.getItem("letters") || "[]")
          const updatedLetters = storedLetters.map((letter: any) =>
            letter.letterId === delivery.letterId
              ? { ...letter, status: "Delivered", deliveredAt: new Date().toISOString() }
              : letter,
          )
          localStorage.setItem("letters", JSON.stringify(updatedLetters))
        }
      }

      setLoadingStates((prev) => ({ ...prev, [trackingId]: false }))

      toast({
        title: "Status Updated",
        description: `Delivery ${trackingId} status updated to ${newStatus}`,
      })

      // Simulate notification
      setTimeout(() => {
        toast({
          title: "Notification Sent",
          description: `${newStatus} notification sent to relevant departments`,
        })
      }, 1500)
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Picked Up":
        return "bg-blue-100 text-blue-800"
      case "In Transit":
        return "bg-yellow-100 text-yellow-800"
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Failed":
        return "bg-red-100 text-red-800"
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
    { id: "deliveries", title: "My Deliveries", icon: "🚚" },
    { id: "tracking", title: "Live Tracking", icon: "📍" },
    { id: "completed", title: "Completed", icon: "✅" },
  ]

  const filteredDeliveries = getFilteredDeliveries()

  const renderContent = () => {
    switch (activeTab) {
      case "deliveries":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">All My Deliveries</h2>
            <p className="text-gray-600 mb-6">Complete list of all your assigned deliveries</p>
            {renderDeliveriesTable(filteredDeliveries)}
          </div>
        )
      case "tracking":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Live Tracking</h2>
            <p className="text-gray-600 mb-6">Real-time tracking of active deliveries</p>
            {renderLiveTracking()}
            {renderDeliveriesTable(filteredDeliveries.filter((d) => d.status !== "Delivered"))}
          </div>
        )
      case "completed":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Completed Deliveries</h2>
            <p className="text-gray-600 mb-6">Successfully delivered packages</p>
            {renderCompletedDeliveries()}
          </div>
        )
      default:
        return renderDeliveriesTable(filteredDeliveries)
    }
  }

  const renderLiveTracking = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {filteredDeliveries
        .filter((d) => d.status === "In Transit" || d.status === "Picked Up")
        .map((delivery, index) => (
          <Card key={index} className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">{delivery.trackingId}</h3>
                <Badge className={getStatusColor(delivery.status)}>{delivery.status}</Badge>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center">
                  <Navigation className="h-3 w-3 mr-1" />
                  <span>To: {delivery.department}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>Location: {delivery.currentLocation}</span>
                </div>
                <div className="flex items-center">
                  <Truck className="h-3 w-3 mr-1" />
                  <span>Letter: {delivery.letterId}</span>
                </div>
              </div>
              <div className="mt-3 flex space-x-1">
                {delivery.status === "Picked Up" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(delivery.trackingId, "In Transit")}
                    disabled={loadingStates[delivery.trackingId]}
                    className="text-xs"
                  >
                    {loadingStates[delivery.trackingId] ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "Start Transit"
                    )}
                  </Button>
                )}
                {delivery.status === "In Transit" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(delivery.trackingId, "Delivered")}
                    disabled={loadingStates[delivery.trackingId]}
                    className="text-xs"
                  >
                    {loadingStates[delivery.trackingId] ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "Mark Delivered"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  )

  const renderCompletedDeliveries = () => {
    const completedDeliveries = deliveries.filter((d) => d.status === "Delivered")

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Completed</p>
                  <p className="text-2xl font-bold text-green-600">{completedDeliveries.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Deliveries</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {
                      completedDeliveries.filter(
                        (d) => d.deliveredAt && d.deliveredAt.split("T")[0] === new Date().toISOString().split("T")[0],
                      ).length
                    }
                  </p>
                </div>
                <div className="text-2xl">📦</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-green-600">100%</p>
                </div>
                <div className="text-2xl">🎯</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {renderDeliveriesTable(completedDeliveries)}
      </div>
    )
  }

  const renderDeliveriesTable = (deliveriesToShow: any[]) => (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by tracking ID, letter ID, or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Picked Up">Picked Up</SelectItem>
            <SelectItem value="In Transit">In Transit</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="Urgent">Urgent</SelectItem>
            <SelectItem value="Normal">Normal</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tracking ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Letter ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">To</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Department</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Priority</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {deliveriesToShow.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                    ? "No deliveries found matching your criteria"
                    : activeTab === "completed"
                      ? "No completed deliveries yet"
                      : activeTab === "tracking"
                        ? "No active deliveries to track"
                        : "No deliveries assigned yet"}
                </td>
              </tr>
            ) : (
              deliveriesToShow.map((delivery, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{delivery.trackingId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{delivery.letterId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{delivery.to}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{delivery.department}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge className={getPriorityColor(delivery.priority)}>{delivery.priority}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Badge className={getStatusColor(delivery.status)}>{delivery.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {delivery.status === "Picked Up" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateStatus(delivery.trackingId, "In Transit")}
                          disabled={loadingStates[delivery.trackingId]}
                          className="text-blue-600 hover:text-blue-700"
                          title="Mark In Transit"
                        >
                          {loadingStates[delivery.trackingId] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Start Transit"
                          )}
                        </Button>
                      )}
                      {delivery.status === "In Transit" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateStatus(delivery.trackingId, "Delivered")}
                          disabled={loadingStates[delivery.trackingId]}
                          className="text-green-600 hover:text-green-700"
                          title="Mark Delivered"
                        >
                          {loadingStates[delivery.trackingId] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Mark Delivered"
                          )}
                        </Button>
                      )}
                      {delivery.status === "Delivered" && (
                        <div className="text-xs text-green-600">
                          Delivered
                          <br />
                          {delivery.deliveredAt?.split("T")[0]}
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
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} menuItems={menuItems} userRole="courier" />
      <div className="flex-1">
        <div className="bg-white min-h-screen">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Courier Dashboard</h1>
                <p className="text-gray-600">Welcome {user?.name} - Track and manage your deliveries</p>
              </div>
              <Button onClick={loadDeliveries} variant="outline">
                Refresh Deliveries
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
                      <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                      <p className="text-2xl font-bold text-gray-900">{deliveries.length}</p>
                    </div>
                    <Truck className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">In Transit</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {deliveries.filter((d) => d.status === "In Transit").length}
                      </p>
                    </div>
                    <MapPin className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Delivered</p>
                      <p className="text-2xl font-bold text-green-600">
                        {deliveries.filter((d) => d.status === "Delivered").length}
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
                        {deliveries.filter((d) => d.priority === "Urgent").length}
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
