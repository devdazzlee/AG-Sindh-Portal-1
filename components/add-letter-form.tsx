"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scan, QrCode, FileText, Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddLetterFormProps {
  onSubmit: (data: any) => void
}

export function AddLetterForm({ onSubmit }: AddLetterFormProps) {
  const [formData, setFormData] = useState({
    sender: "",
    department: "",
    subject: "",
    priority: "",
    description: "",
    recipientName: "",
    recipientDepartment: "",
  })
  const [scannedDocument, setScannedDocument] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const { toast } = useToast()

  const handleScanDocument = () => {
    setIsScanning(true)

    // Simulate scanner integration
    setTimeout(() => {
      setScannedDocument("document_scan_" + Date.now() + ".pdf")
      setIsScanning(false)
      toast({
        title: "Document Scanned",
        description: "Document has been successfully scanned and saved",
      })
    }, 3000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.sender || !formData.department || !formData.subject || !formData.priority) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (!scannedDocument) {
      toast({
        title: "Error",
        description: "Please scan the document first",
        variant: "destructive",
      })
      return
    }

    onSubmit(formData)

    toast({
      title: "Success",
      description: "Letter added successfully with barcode generated",
    })

    // Reset form
    setFormData({
      sender: "",
      department: "",
      subject: "",
      priority: "",
      description: "",
      recipientName: "",
      recipientDepartment: "",
    })
    setScannedDocument(null)
  }

  return (
    <div className="space-y-6">
      {/* Document Scanner Section */}
      <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Scan className="h-5 w-5 mr-2" />
            Document Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            {scannedDocument ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-green-700 font-medium">Document Scanned Successfully</p>
                <p className="text-sm text-gray-600">{scannedDocument}</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setScannedDocument(null)}
                  className="text-blue-600 border-blue-600"
                >
                  Scan New Document
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto">
                  <Camera className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium mb-2">Place document in scanner and click scan</p>
                  <Button
                    type="button"
                    onClick={handleScanDocument}
                    disabled={isScanning}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isScanning ? (
                      <>
                        <Scan className="h-4 w-4 mr-2 animate-pulse" />
                        Scanning Document...
                      </>
                    ) : (
                      <>
                        <Scan className="h-4 w-4 mr-2" />
                        Start Scanner
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Letter Information Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Letter Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sender">Sender Name *</Label>
                <Input
                  id="sender"
                  value={formData.sender}
                  onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                  placeholder="Enter sender name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Sender Department *</Label>
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
                    <SelectItem value="External">External</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input
                  id="recipientName"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  placeholder="Enter recipient name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientDepartment">Recipient Department</Label>
                <Select
                  value={formData.recipientDepartment}
                  onValueChange={(value) => setFormData({ ...formData, recipientDepartment: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Agriculture">Agriculture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Enter letter subject"
                required
              />
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
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter letter description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            <QrCode className="h-4 w-4 mr-2" />
            Save Letter & Generate Barcode
          </Button>
        </div>
      </form>
    </div>
  )
}
