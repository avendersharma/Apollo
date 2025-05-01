"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface FiltersProps {
  onFilterChange: (filters: Record<string, string | number | boolean>) => void
}

export default function Filters({ onFilterChange }: FiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [expanded, setExpanded] = useState({
    gender: true,
    experience: true,
    availability: true,
    location: true,
    language: true,
    sortBy: true,
  })

  const [filters, setFilters] = useState({
    gender: searchParams.get("gender") || "",
    experience: searchParams.get("experience") ? Number.parseInt(searchParams.get("experience")!) : 0,
    availability: searchParams.get("availability") || "",
    location: searchParams.get("location") || "",
    language: searchParams.get("language") || "",
    sortBy: searchParams.get("sortBy") || "rating",
  })

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleFilterChange = (key: string, value: string | number | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  useEffect(() => {
    onFilterChange(filters)

    // Update URL with filters
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value))
      }
    })

    const url = `/specialties/general-physician-internal-medicine?${params.toString()}`
    router.push(url, { scroll: false })
  }, [filters, onFilterChange, router])

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFilters({
              gender: "",
              experience: 0,
              availability: "",
              location: "",
              language: "",
              sortBy: "rating",
            })
          }}
        >
          Clear All
        </Button>
      </div>

      {/* Gender Filter */}
      <div className="border-b pb-3 mb-3">
        <div className="flex justify-between items-center cursor-pointer mb-2" onClick={() => toggleSection("gender")}>
          <h3 className="font-medium">Gender</h3>
          {expanded.gender ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {expanded.gender && (
          <RadioGroup value={filters.gender} onValueChange={(value) => handleFilterChange("gender", value)}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="any-gender" />
              <Label htmlFor="any-gender">Any</Label>
            </div>
          </RadioGroup>
        )}
      </div>

      {/* Experience Filter */}
      <div className="border-b pb-3 mb-3">
        <div
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection("experience")}
        >
          <h3 className="font-medium">Experience</h3>
          {expanded.experience ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {expanded.experience && (
          <div>
            <div className="mb-2">
              <Slider
                defaultValue={[filters.experience]}
                max={30}
                step={1}
                onValueChange={(value) => handleFilterChange("experience", value[0])}
              />
            </div>
            <div className="text-sm text-gray-600">
              {filters.experience > 0 ? `${filters.experience}+ years` : "Any experience"}
            </div>
          </div>
        )}
      </div>

      {/* Availability Filter */}
      <div className="border-b pb-3 mb-3">
        <div
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection("availability")}
        >
          <h3 className="font-medium">Availability</h3>
          {expanded.availability ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {expanded.availability && (
          <RadioGroup value={filters.availability} onValueChange={(value) => handleFilterChange("availability", value)}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="today" id="today" />
              <Label htmlFor="today">Available Today</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="tomorrow" id="tomorrow" />
              <Label htmlFor="tomorrow">Available Tomorrow</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="any-day" />
              <Label htmlFor="any-day">Any Day</Label>
            </div>
          </RadioGroup>
        )}
      </div>

      {/* Location Filter */}
      <div className="border-b pb-3 mb-3">
        <div
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection("location")}
        >
          <h3 className="font-medium">Location</h3>
          {expanded.location ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {expanded.location && (
          <div className="space-y-2">
            {["Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad"].map((city) => (
              <div key={city} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${city}`}
                  checked={filters.location === city}
                  onCheckedChange={() => handleFilterChange("location", filters.location === city ? "" : city)}
                />
                <Label htmlFor={`location-${city}`}>{city}</Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Language Filter */}
      <div className="border-b pb-3 mb-3">
        <div
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection("language")}
        >
          <h3 className="font-medium">Language</h3>
          {expanded.language ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {expanded.language && (
          <div className="space-y-2">
            {["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam"].map((lang) => (
              <div key={lang} className="flex items-center space-x-2">
                <Checkbox
                  id={`lang-${lang}`}
                  checked={filters.language === lang}
                  onCheckedChange={() => handleFilterChange("language", filters.language === lang ? "" : lang)}
                />
                <Label htmlFor={`lang-${lang}`}>{lang}</Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sort By Filter */}
      <div>
        <div className="flex justify-between items-center cursor-pointer mb-2" onClick={() => toggleSection("sortBy")}>
          <h3 className="font-medium">Sort By</h3>
          {expanded.sortBy ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {expanded.sortBy && (
          <RadioGroup value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="rating" id="rating" />
              <Label htmlFor="rating">Rating</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="experience" id="sort-experience" />
              <Label htmlFor="sort-experience">Experience</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fees" id="fees" />
              <Label htmlFor="fees">Fees (Low to High)</Label>
            </div>
          </RadioGroup>
        )}
      </div>
    </div>
  )
}
