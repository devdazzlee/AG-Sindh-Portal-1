"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddLetterForm } from "@/components/add-letter-form"

const mockLetters = [
  { id: "Ahmed Ali", receivedDate: "04/11/2024", department: "Finance" },
  { id: "M. Khan", receivedDate: "04/11/2024", department: "Education" },
  { id: "Sarah Shah", receivedDate: "04/10/2024", department: "Health" },
  { id: "Aisha Qureshi", receivedDate: "04/10/2024", department: "Finance" },
  { id: "Tariq Mehmood", receivedDate: "04/11/2024", department: "Finance" },
  { id: "Ali Raza", receivedDate: "04/12/2024", department: "Finance" },
  { id: "Umer Farooq", receivedDate: "04/12/2024", department: "Health" },
  { id: "Ahmed Ali", receivedDate: "04/11/2024", department: "Finance" },
]

export function IncomingLetters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [letters, setLetters] = useState(mockLetters)

  const filteredLetters = letters.filter(
    (letter) =>
      letter.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Incoming</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Letter
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Incoming Letter</DialogTitle>
              </DialogHeader>
              <AddLetterForm
                onSubmit={(data) => {
                  const newLetter = {
                    id: data.sender,
                    receivedDate: new Date().toLocaleDateString("en-GB"),
                    department: data.department,
                  }
                  setLetters([...letters, newLetter])
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="px-8 py-4 bg-gray-50 border-b border-gray-200">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search letters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Received Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Department</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLetters.map((letter, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{letter.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{letter.receivedDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{letter.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
