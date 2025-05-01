import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import DoctorModel from "@/lib/models/doctorModel"
import type { DoctorFilters } from "@/lib/models/doctor"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const filters: DoctorFilters = {
      specialty: searchParams.get("specialty") || undefined,
      gender: searchParams.get("gender") || undefined,
      experience: searchParams.get("experience") ? Number.parseInt(searchParams.get("experience")!) : undefined,
      availability: searchParams.get("availability") || undefined,
      location: searchParams.get("location") || undefined,
      language: searchParams.get("language") || undefined,
      sortBy: (searchParams.get("sortBy") as DoctorFilters["sortBy"]) || undefined,
      page: searchParams.get("page") ? Number.parseInt(searchParams.get("page")!) : 1,
      limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 10,
    }

    // Build query
    const query: any = {}
    if (filters.specialty) query.specialty = filters.specialty
    if (filters.gender) query.gender = filters.gender
    if (filters.experience) query.experience = { $gte: filters.experience }
    if (filters.location) query.location = filters.location
    if (filters.language) query.languages = filters.language
    if (filters.availability === "today") query["availability.today"] = true
    if (filters.availability === "tomorrow") query["availability.tomorrow"] = true

    // Build sort
    let sort: any = {}
    if (filters.sortBy === "experience") sort.experience = -1
    else if (filters.sortBy === "rating") sort.rating = -1
    else if (filters.sortBy === "fees") sort.fees = 1
    else sort = { rating: -1, experience: -1 } // Default sort

    // Calculate pagination
    const page = filters.page || 1
    const limit = filters.limit || 10
    const skip = (page - 1) * limit

    // Execute query
    const doctors = await DoctorModel.find(query).sort(sort).skip(skip).limit(limit)

    const total = await DoctorModel.countDocuments(query)
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      doctors,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    })
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const data = await request.json()

    // Validate required fields
    const requiredFields = ["name", "specialty", "experience", "location", "hospital", "fees", "gender"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const doctor = await DoctorModel.create(data)

    return NextResponse.json(doctor, { status: 201 })
  } catch (error) {
    console.error("Error adding doctor:", error)
    return NextResponse.json({ error: "Failed to add doctor" }, { status: 500 })
  }
}
