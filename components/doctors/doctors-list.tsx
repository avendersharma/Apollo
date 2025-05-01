"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import DoctorCard from "./doctor-card";
import Filters from "./filters";
import { Doctor, DoctorFilters } from "@/lib/models/doctor";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface DoctorsListProps {
  specialty: string;
}

export default function DoctorsList({ specialty }: DoctorsListProps) {
  const searchParams = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  // Memoized search params string to prevent infinite renders
  const serializedSearchParams = useMemo(() => searchParams.toString(), [searchParams]);

  const getFiltersFromSearchParams = () => {
    const gender = searchParams.get("gender") || undefined;
    const experience = searchParams.get("experience")
      ? Number.parseInt(searchParams.get("experience")!)
      : undefined;
    const availability = searchParams.get("availability") || undefined;
    const location = searchParams.get("location") || undefined;
    const language = searchParams.get("language") || undefined;
    const sortBy =
      (searchParams.get("sortBy") as DoctorFilters["sortBy"]) || undefined;
    const page = searchParams.get("page")
      ? Number.parseInt(searchParams.get("page")!)
      : 1;

    return { gender, experience, availability, location, language, sortBy, page };
  };

  const fetchDoctors = async (filters: DoctorFilters = {}) => {
    setLoading(true);

    const params = new URLSearchParams();
    params.set("specialty", specialty);

    if (filters.gender) params.set("gender", filters.gender);
    if (filters.experience)
      params.set("experience", filters.experience.toString());
    if (filters.availability) params.set("availability", filters.availability);
    if (filters.location) params.set("location", filters.location);
    if (filters.language) params.set("language", filters.language);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.page) params.set("page", filters.page.toString());
    params.set("limit", "10");

    try {
      const response = await fetch(`/api/doctors?${params.toString()}`);
      const data = await response.json();

      if (data.doctors) {
        setDoctors(data.doctors);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filters = getFiltersFromSearchParams();
    const debounceTimeout = setTimeout(() => {
      fetchDoctors({
        ...filters,
        specialty,
      });
    }, 300); // Debounce to prevent rapid API calls

    return () => clearTimeout(debounceTimeout);
  }, [specialty, serializedSearchParams]); // Depend on stable values

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
    });
  };

  const handlePageChange = (newPage: number) => {
    fetchDoctors({
      ...getFiltersFromSearchParams(),
      page: newPage,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/4">
        <Filters onFilterChange={handleFilterChange} />
      </div>
      <div className="w-full md:w-3/4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {loading ? "Loading doctors..." : `${pagination.total} Doctors found`}
          </h2>
          <p className="text-gray-600">
            Book appointments with the best General Physicians
          </p>
        </div>
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-4">
              <div className="flex flex-col md:flex-row">
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
            </div>
          ))
        ) : doctors.length > 0 ? (
          <>
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={pagination.page === page ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div>No doctors found</div>
        )}
      </div>
    </div>
  );
}
