"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Scan, QrCode, Camera, FileText, Printer, Video, VideoOff, Loader2, Upload, X, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ScanAndGenerate() {
  const [scannedDocument, setScannedDocument] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [generatedQR, setGeneratedQR] = useState<string | null>(null)
  const [scanProgress, setScanProgress] = useState(0)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [documentPreview, setDocumentPreview] = useState<string | null>(null)
  const [scannerStatus, setScannerStatus] = useState<"idle" | "ready" | "scanning" | "complete">("idle")

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    department: "",
    priority: "",
    subject: "",
    description: "",
    receivedDate: new Date().toISOString().split("T")[0],
    receivedTime: new Date().toTimeString().split(" ")[0].slice(0, 5),
  })

  const { toast } = useToast()

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
        setScannerStatus("ready")
        toast({
          title: "Camera Started",
          description: "Position document in camera view and click capture",
        })
      }
    } catch (error) {
      console.error("Camera error:", error)
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions or try file upload.",
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
      setScannerStatus("idle")
    }
  }

  const captureDocument = () => {
    if (videoRef.current && canvasRef.current) {
      setIsScanning(true)
      setScannerStatus("scanning")
      setScanProgress(0)

      // Simulate scanning progress
      const progressInterval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + 10
        })
      }, 200)

      setTimeout(() => {
        const canvas = canvasRef.current!
        const video = videoRef.current!
        const context = canvas.getContext("2d")!

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Set crossOrigin to avoid CORS issues
        context.drawImage(video, 0, 0)

        const capturedImage = canvas.toDataURL("image/jpeg", 0.8)
        setScannedDocument(capturedImage)
        setDocumentPreview(capturedImage)
        stopCamera()
        setIsScanning(false)
        setScannerStatus("complete")

        toast({
          title: "Document Captured",
          description: "Document has been successfully captured and is ready for processing",
        })
      }, 2000)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setScannedDocument(result)
          setDocumentPreview(result)
          setScannerStatus("complete")
          toast({
            title: "File Uploaded",
            description: "Document has been uploaded successfully",
          })
        }
        reader.readAsDataURL(file)
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive",
        })
      }
    }
  }

  const handlePhysicalScan = () => {
    setIsScanning(true)
    setScannerStatus("scanning")
    setScanProgress(0)

    // Simulate physical scanner progress
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 5
      })
    }, 150)

    setTimeout(() => {
      // Generate a placeholder scanned document
      const canvas = document.createElement("canvas")
      canvas.width = 600
      canvas.height = 800
      const ctx = canvas.getContext("2d")!

      // Create a document-like appearance
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, 600, 800)

      ctx.fillStyle = "#000000"
      ctx.font = "16px Arial"
      ctx.fillText("SCANNED DOCUMENT", 50, 50)
      ctx.fillText(`Scan Date: ${new Date().toLocaleString()}`, 50, 80)
      ctx.fillText("Document Content...", 50, 120)

      // Add some lines to simulate text
      for (let i = 0; i < 20; i++) {
        ctx.fillRect(50, 150 + i * 25, 500, 2)
      }

      const scannedData = canvas.toDataURL("image/jpeg", 0.8)
      setScannedDocument(scannedData)
      setDocumentPreview(scannedData)
      setIsScanning(false)
      setScannerStatus("complete")

      toast({
        title: "Document Scanned Successfully",
        description: "Document has been scanned using physical scanner",
      })
    }, 3000)
  }

  const handleGenerateQR = () => {
    if (!formData.from || !formData.to || !formData.department || !formData.priority) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (From, To, Department, Priority)",
        variant: "destructive",
      })
      return
    }

    if (!scannedDocument) {
      toast({
        title: "No Document Scanned",
        description: "Please scan or upload a document first",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)

    // Simulate QR generation progress
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 8
      })
    }, 200)

    setTimeout(() => {
      // Generate unique letter ID and QR code
      const letterId = `LTR${Date.now().toString().slice(-6)}`
      const timestamp = new Date().toISOString()

      const qrData = {
        letterId,
        from: formData.from,
        to: formData.to,
        department: formData.department,
        priority: formData.priority,
        date: formData.receivedDate,
        time: formData.receivedTime,
        subject: formData.subject,
        description: formData.description,
        documentUrl: scannedDocument,
        status: "Generated",
        createdAt: timestamp,
        createdBy: "RD Department",
      }

      // Generate QR code (placeholder)
      const qrCanvas = document.createElement("canvas")
      qrCanvas.width = 200
      qrCanvas.height = 200
      const qrCtx = qrCanvas.getContext("2d")!

      // Create QR code pattern
      qrCtx.fillStyle = "#ffffff"
      qrCtx.fillRect(0, 0, 200, 200)
      qrCtx.fillStyle = "#000000"

      // Simple QR-like pattern
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          if (Math.random() > 0.5) {
            qrCtx.fillRect(i * 10, j * 10, 10, 10)
          }
        }
      }

      // Add letter ID text
      qrCtx.fillStyle = "#ffffff"
      qrCtx.fillRect(50, 85, 100, 30)
      qrCtx.fillStyle = "#000000"
      qrCtx.font = "12px Arial"
      qrCtx.textAlign = "center"
      qrCtx.fillText(letterId, 100, 105)

      const qrCodeUrl = qrCanvas.toDataURL("image/png")
      setGeneratedQR(qrCodeUrl)

      // Save to localStorage
      const existingLetters = JSON.parse(localStorage.getItem("letters") || "[]")
      existingLetters.push(qrData)
      localStorage.setItem("letters", JSON.stringify(existingLetters))

      setIsGenerating(false)

      toast({
        title: "QR Code Generated",
        description: `Letter ${letterId} has been created and QR code generated successfully`,
      })

      // Simulate notification to department
      setTimeout(() => {
        toast({
          title: "Department Notified",
          description: `${formData.department} department has been notified about the new letter`,
        })
      }, 2000)
    }, 3000)
  }

  const handlePrintQR = () => {
    if (generatedQR) {
      setIsPrinting(true)

      setTimeout(() => {
        setIsPrinting(false)
        toast({
          title: "QR Code Printed",
          description: "QR code has been sent to the printer successfully",
        })
      }, 2000)
    }
  }

  const resetForm = () => {
    setScannedDocument(null)
    setDocumentPreview(null)
    setGeneratedQR(null)
    setScannerStatus("idle")
    setScanProgress(0)
    setGenerationProgress(0)
    stopCamera()
    setFormData({
      from: "",
      to: "",
      department: "",
      priority: "",
      subject: "",
      description: "",
      receivedDate: new Date().toISOString().split("T")[0],
      receivedTime: new Date().toTimeString().split(" ")[0].slice(0, 5),
    })

    toast({
      title: "Form Reset",
      description: "All fields have been cleared",
    })
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Scan & Generate QR Code</h1>
            <p className="text-gray-600">Digitize documents and generate tracking QR codes</p>
          </div>
          <Button onClick={resetForm} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Reset Form
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Document Scanner */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scan className="h-5 w-5 mr-2" />
                Document Scanner
                {scannerStatus === "complete" && <CheckCircle className="h-5 w-5 ml-2 text-green-600" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scannedDocument ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-4 bg-green-50">
                    <img
                      src={documentPreview || scannedDocument}
                      alt="Scanned Document"
                      className="w-full h-64 object-contain rounded border"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        setScannedDocument(null)
                        setDocumentPreview(null)
                        setScannerStatus("idle")
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Scan New Document
                    </Button>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      View Full Size
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Camera Scanner */}
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

                        {isScanning && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Capturing document...</span>
                              <span>{scanProgress}%</span>
                            </div>
                            <Progress value={scanProgress} className="w-full" />
                          </div>
                        )}

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
                            onClick={captureDocument}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            disabled={isScanning}
                          >
                            {isScanning ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Capturing...
                              </>
                            ) : (
                              <>
                                <Camera className="h-4 w-4 mr-2" />
                                Capture Document
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Camera className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                        <p className="text-gray-700 mb-4">Use camera to scan documents</p>
                        <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700">
                          <Video className="h-4 w-4 mr-2" />
                          Start Camera
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* File Upload */}
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center bg-purple-50">
                    <Upload className="h-16 w-16 mx-auto mb-4 text-purple-600" />
                    <p className="text-gray-700 mb-4">Upload document file</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button onClick={() => fileInputRef.current?.click()} className="bg-purple-600 hover:bg-purple-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>

                  {/* Physical Scanner */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Scan className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-700 mb-4">Use physical scanner</p>

                    {isScanning && scannerStatus === "scanning" && (
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Scanning document...</span>
                          <span>{scanProgress}%</span>
                        </div>
                        <Progress value={scanProgress} className="w-full" />
                      </div>
                    )}

                    <Button
                      onClick={handlePhysicalScan}
                      disabled={isScanning}
                      className="bg-gray-600 hover:bg-gray-700"
                    >
                      {isScanning ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Scan className="h-4 w-4 mr-2" />
                          Start Physical Scanner
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Side - Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Letter Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">From *</Label>
                  <Input
                    id="from"
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    placeholder="Sender name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to">To *</Label>
                  <Input
                    id="to"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    placeholder="Recipient name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Agriculture">Agriculture</SelectItem>
                      <SelectItem value="Planning">Planning & Development</SelectItem>
                      <SelectItem value="Works">Works & Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="receivedDate">Received Date</Label>
                  <Input
                    id="receivedDate"
                    type="date"
                    value={formData.receivedDate}
                    onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receivedTime">Received Time</Label>
                  <Input
                    id="receivedTime"
                    type="time"
                    value={formData.receivedTime}
                    onChange={(e) => setFormData({ ...formData, receivedTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Letter subject"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional notes or description"
                  rows={3}
                />
              </div>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Generating QR Code...</span>
                    <span>{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="w-full" />
                </div>
              )}

              <Button
                onClick={handleGenerateQR}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!scannedDocument || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating QR Code...
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </>
                )}
              </Button>

              {generatedQR && (
                <div className="mt-6 p-4 border rounded-lg bg-green-50">
                  <h3 className="font-semibold mb-3 text-green-800 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    QR Code Generated Successfully!
                  </h3>
                  <div className="flex items-center space-x-4">
                    <img
                      src={generatedQR || "/placeholder.svg"}
                      alt="Generated QR Code"
                      className="w-32 h-32 border rounded"
                      crossOrigin="anonymous"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">QR code is ready for printing and attachment</p>
                      <div className="space-y-2">
                        <Button
                          onClick={handlePrintQR}
                          className="bg-blue-600 hover:bg-blue-700 w-full"
                          disabled={isPrinting}
                        >
                          {isPrinting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Printing...
                            </>
                          ) : (
                            <>
                              <Printer className="h-4 w-4 mr-2" />
                              Print QR Code
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={() => {
                            const link = document.createElement("a")
                            link.download = `QR-${Date.now()}.png`
                            link.href = generatedQR
                            link.click()
                          }}
                        >
                          Download QR Code
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
