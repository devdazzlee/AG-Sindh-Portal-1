"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { SuperAdminDashboard } from "@/components/super-admin-dashboard"
import { RDDashboard } from "@/components/rd-dashboard"
import { DepartmentDashboard } from "@/components/department-dashboard"
import { CourierDashboard } from "@/components/courier-dashboard"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  switch (user.role) {
    case "super-admin":
      return <SuperAdminDashboard />
    case "rd-department":
      return <RDDashboard />
    case "department":
      return <DepartmentDashboard />
    case "courier":
      return <CourierDashboard />
    default:
      return <div>Invalid role</div>
  }
}
