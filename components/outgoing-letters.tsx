"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"

const mockOutgoingLetters = [
  { id: "Ministry of Finance", sentDate: "04/11/2024", department: "Finance", status: "Delivered" },
  { id: "Education Department KHI", sentDate: "04/10/2024", department: "Education", status: "In Transit" },
  { id: "Health Ministry", sentDate: "04/09/2024", department: "Health", status: "Pending" },
]

export function OutgoingLetters() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredLetters = mockOutgoingLetters.filter(
    (letter) =>
      letter.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Outgoing</h1>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Send New Letter
          </Button>
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Recipient</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sent Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Department</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLetters.map((letter, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{letter.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{letter.sentDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{letter.department}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        letter.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : letter.status === "In Transit"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {letter.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
