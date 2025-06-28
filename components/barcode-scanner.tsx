"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QrCode, Scan, Camera, Video, VideoOff, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function BarcodeScanner() {
  const [scannedCode, setScannedCode] = useState("")
  const [scanResult, setScanResult] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 640, height: 480 },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
        toast({
          title: "Camera Started",
          description: "Point camera at QR code to scan",
        })
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsCameraActive(false)
    }
  }

  const captureQRCode = () => {
    if (videoRef.current && canvasRef.current) {
      setIsScanning(true)

      setTimeout(() => {
        // Simulate QR code detection
        const mockQRData = "LTR" + Math.floor(Math.random() * 900000 + 100000)
        setScannedCode(mockQRData)
        handleManualScan(mockQRData)
        stopCamera()
        setIsScanning(false)
      }, 2000)
    }
  }

  const handleManualScan = (codeToScan?: string) => {
    const searchCode = codeToScan || scannedCode

    if (!searchCode) {
      toast({
        title: "Error",
        description: "Please enter a barcode to scan",
        variant: "destructive",
      })
      return
    }

    setIsScanning(true)

    // Search for letter in localStorage
    setTimeout(() => {
      const storedLetters = JSON.parse(localStorage.getItem("letters") || "[]")
      const foundLetter = storedLetters.find(
        (letter: any) =>
          letter.letterId === searchCode || letter.letterId?.toLowerCase().includes(searchCode.toLowerCase()),
      )

      if (foundLetter) {
        setScanResult(foundLetter)
        toast({
          title: "Scan Successful",
          description: "Letter information retrieved successfully",
        })
      } else {
        setScanResult(null)
        toast({
          title: "Letter Not Found",
          description: `No letter found with barcode: ${searchCode}`,
          variant: "destructive",
        })
      }
      setIsScanning(false)
    }, 2000)
  }

  const handleStatusUpdate = (newStatus: string) => {
    if (scanResult) {
      setIsUpdating(true)

      setTimeout(() => {
        // Update letter status in localStorage
        const storedLetters = JSON.parse(localStorage.getItem("letters") || "[]")
        const updatedLetters = storedLetters.map((letter: any) =>
          letter.letterId === scanResult.letterId
            ? { ...letter, status: newStatus, updatedAt: new Date().toISOString() }
            : letter,
        )
        localStorage.setItem("letters", JSON.stringify(updatedLetters))

        setScanResult({ ...scanResult, status: newStatus })
        setIsUpdating(false)

        toast({
          title: "Status Updated",
          description: `Letter ${scanResult.letterId} status updated to ${newStatus}`,
        })
      }, 1500)
    }
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

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900">QR Code Scanner</h1>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanner Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="h-5 w-5 mr-2" />
                QR Code Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Camera Scanner */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
                  {isCameraActive ? (
                    <div className="space-y-4">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-64 object-cover rounded bg-black"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      <div className="flex space-x-2">
                        <Button
                          onClick={stopCamera}
                          variant="outline"
                          className="flex-1 bg-transparent"
                          disabled={isScanning}
                        >
                          <VideoOff className="h-4 w-4 mr-2" />
                          Stop Camera
                        </Button>
                        <Button
                          onClick={captureQRCode}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          disabled={isScanning}
                        >
                          {isScanning ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Scanning...
                            </>
                          ) : (
                            <>
                              <QrCode className="h-4 w-4 mr-2" />
                              Scan QR Code
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Camera className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                      <p className="text-gray-700 mb-4">Use camera to scan QR codes</p>
                      <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700">
                        <Video className="h-4 w-4 mr-2" />
                        Start Camera
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Manual Entry */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Manual Entry</label>
                <Input
                  placeholder="Enter Letter ID or scan barcode..."
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                />
              </div>

              <Button
                onClick={() => handleManualScan()}
                disabled={isScanning}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Scan className="h-4 w-4 mr-2" />
                    Search Letter
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Scan Result</CardTitle>
            </CardHeader>
            <CardContent>
              {scanResult ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-green-800">Letter Found</h3>
                      <Badge className={getStatusColor(scanResult.status)}>{scanResult.status}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium">Letter ID:</span>
                        <p>{scanResult.letterId}</p>
                      </div>
                      <div>
                        <span className="font-medium">From:</span>
                        <p>{scanResult.from}</p>
                      </div>
                      <div>
                        <span className="font-medium">To:</span>
                        <p>{scanResult.to}</p>
                      </div>
                      <div>
                        <span className="font-medium">Department:</span>
                        <p>{scanResult.department}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Subject:</span>
                        <p>{scanResult.subject || "No subject"}</p>
                      </div>
                      <div>
                        <span className="font-medium">Date:</span>
                        <p>{scanResult.date}</p>
                      </div>
                      <div>
                        <span className="font-medium">Priority:</span>
                        <Badge
                          className={
                            scanResult.priority === "Urgent" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                          }
                        >
                          {scanResult.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Update Status</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate("In Transit")}
                        disabled={scanResult.status === "In Transit" || isUpdating}
                      >
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mark In Transit"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate("Delivered")}
                        disabled={scanResult.status === "Delivered" || isUpdating}
                      >
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mark Delivered"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate("Received")}
                        disabled={scanResult.status === "Received" || isUpdating}
                      >
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mark Received"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate("Returned")}
                        disabled={isUpdating}
                      >
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mark Returned"}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <QrCode className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Scan a QR code or enter Letter ID to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
