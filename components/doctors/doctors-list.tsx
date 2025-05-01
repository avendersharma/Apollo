"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import DoctorCard from "./doctor-card"
import Filters from "./filters"
import type { Doctor, DoctorFilters } from "@/lib/models/doctor"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface DoctorsListProps {
  specialty: string
}

export default function DoctorsList({ specialty }: DoctorsListProps) {
  const searchParams = useSearchParams()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })

  const fetchDoctors = async (filters: DoctorFilters = {}) => {
    setLoading(true)

    // Build query string
    const params = new URLSearchParams()
    params.set("specialty", specialty)

    if (filters.gender) params.set("gender", filters.gender)
    if (filters.experience) params.set("experience", filters.experience.toString())
    if (filters.availability) params.set("availability", filters.availability)
    if (filters.location) params.set("location", filters.location)
    if (filters.language) params.set("language", filters.language)
    if (filters.sortBy) params.set("sortBy", filters.sortBy)
    if (filters.page) params.set("page", filters.page.toString())
    params.set("limit", "10")

    try {
      const response = await fetch(`/api/doctors?${params.toString()}`)
      const data = await response.json()

      if (data.doctors) {
        setDoctors(data.doctors)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Error fetching doctors:", error)
      // If API fails, use mock data
      setDoctors(getMockDoctors())
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filters: Record<string, string | number | boolean>) => {
    fetchDoctors({
      specialty,
      gender: filters.gender as string,
      experience: filters.experience as number,
      availability: filters.availability as string,
      location: filters.location as string,
      language: filters.language as string,
      sortBy: filters.sortBy as DoctorFilters["sortBy"],
      page: 1,
    })
  }

  const handlePageChange = (newPage: number) => {
    fetchDoctors({
      specialty,
      gender: searchParams.get("gender") || undefined,
      experience: searchParams.get("experience") ? Number.parseInt(searchParams.get("experience")!) : undefined,
      availability: searchParams.get("availability") || undefined,
      location: searchParams.get("location") || undefined,
      language: searchParams.get("language") || undefined,
      sortBy: (searchParams.get("sortBy") as DoctorFilters["sortBy"]) || undefined,
      page: newPage,
    })
  }

  useEffect(() => {
    fetchDoctors({
      specialty,
      gender: searchParams.get("gender") || undefined,
      experience: searchParams.get("experience") ? Number.parseInt(searchParams.get("experience")!) : undefined,
      availability: searchParams.get("availability") || undefined,
      location: searchParams.get("location") || undefined,
      language: searchParams.get("language") || undefined,
      sortBy: (searchParams.get("sortBy") as DoctorFilters["sortBy"]) || undefined,
      page: searchParams.get("page") ? Number.parseInt(searchParams.get("page")!) : 1,
    })
  }, [specialty, searchParams])

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Filters Sidebar */}
      <div className="w-full md:w-1/4">
        <Filters onFilterChange={handleFilterChange} />
      </div>

      {/* Doctors List */}
      <div className="w-full md:w-3/4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {loading ? "Loading doctors..." : `${pagination.total} Doctors found`}
          </h2>
          <p className="text-gray-600">Book appointments with the best General Physicians</p>
        </div>

        {loading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-4">
              <div className="flex flex-col md:flex-row">
                <div className="flex flex-col md:flex-row md:w-2/3">
                  <Skeleton className="w-24 h-24 rounded-full mb-4 md:mb-0 md:mr-6" />
                  <div>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-4 w-40 mb-2" />
                    <Skeleton className="h-4 w-36 mb-2" />
                    <div className="flex gap-2 mb-3">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:w-1/3 md:pl-6 flex flex-col">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-6 w-16 mb-4" />
                  <Skeleton className="h-4 w-32 mb-2" />
                  <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-10 w-full mt-auto" />
                </div>
              </div>
            </div>
          ))
        ) : doctors.length > 0 ? (
          <>
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= pagination.page - 1 && page <= pagination.page + 1),
                    )
                    .map((page, index, array) => {
                      // Add ellipsis
                      if (index > 0 && page - array[index - 1] > 1) {
                        return (
                          <span key={`ellipsis-${page}`} className="flex items-center justify-center w-10 h-10">
                            ...
                          </span>
                        )
                      }

                      return (
                        <Button
                          key={page}
                          variant={pagination.page === page ? "default" : "outline"}
                          className="w-10 h-10 p-0"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      )
                    })}

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-lg font-medium mb-2">No doctors found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Mock data function for fallback
function getMockDoctors(): Doctor[] {
  return [
    {
      id: "1",
      name: "Dr. Rajesh Kumar",
      specialty: "General Physician",
      experience: 15,
      location: "Delhi",
      hospital: "Apollo Hospital, Delhi",
      education: ["MBBS", "MD - General Medicine"],
      languages: ["English", "Hindi"],
      fees: 800,
      rating: 4.8,
      reviewCount: 245,
      availability: {
        today: true,
        tomorrow: true,
        slots: ["10:00 AM", "12:30 PM", "4:00 PM", "6:30 PM"],
      },
      image: "/confident-male-doctor.png",
      gender: "male",
    },
    {
      id: "2",
      name: "Dr. Priya Sharma",
      specialty: "General Physician",
      experience: 12,
      location: "Mumbai",
      hospital: "Apollo Hospital, Mumbai",
      education: ["MBBS", "DNB - Family Medicine"],
      languages: ["English", "Hindi", "Marathi"],
      fees: 1000,
      rating: 4.7,
      reviewCount: 189,
      availability: {
        today: false,
        tomorrow: true,
        slots: ["11:00 AM", "3:00 PM", "5:30 PM"],
      },
      image: "/confident-female-doctor.png",
      gender: "female",
    },
    {
      id: "3",
      name: "Dr. Suresh Patel",
      specialty: "General Physician",
      experience: 20,
      location: "Bangalore",
      hospital: "Apollo Hospital, Bangalore",
      education: ["MBBS", "MD - Internal Medicine", "DM - Cardiology"],
      languages: ["English", "Hindi", "Kannada"],
      fees: 1200,
      rating: 4.9,
      reviewCount: 312,
      availability: {
        today: true,
        tomorrow: true,
        slots: ["9:00 AM", "1:00 PM", "7:00 PM"],
      },
      image: "/confident-male-doctor.png",
      gender: "male",
    },
    {
      id: "4",
      name: "Dr. Ananya Reddy",
      specialty: "General Physician",
      experience: 8,
      location: "Hyderabad",
      hospital: "Apollo Hospital, Hyderabad",
      education: ["MBBS", "MD - General Medicine"],
      languages: ["English", "Hindi", "Telugu"],
      fees: 700,
      rating: 4.5,
      reviewCount: 156,
      availability: {
        today: true,
        tomorrow: false,
        slots: ["10:30 AM", "2:30 PM", "6:00 PM"],
      },
      image: "/confident-female-doctor.png",
      gender: "female",
    },
    {
      id: "5",
      name: "Dr. Vikram Singh",
      specialty: "General Physician",
      experience: 18,
      location: "Chennai",
      hospital: "Apollo Hospital, Chennai",
      education: ["MBBS", "MD - Internal Medicine"],
      languages: ["English", "Hindi", "Tamil"],
      fees: 900,
      rating: 4.6,
      reviewCount: 210,
      availability: {
        today: false,
        tomorrow: true,
        slots: ["11:30 AM", "3:30 PM", "7:30 PM"],
      },
      image: "/confident-male-doctor.png",
      gender: "male",
    },
  ]
}
