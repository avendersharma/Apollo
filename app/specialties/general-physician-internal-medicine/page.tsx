import type { Metadata } from "next"
import DoctorsList from "@/components/doctors/doctors-list"
import Header from "@/components/header"
import StructuredData from "@/components/structured-data"
import { getMockDoctors } from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "General Physician & Internal Medicine Specialists | Apollo 247 Clone",
  description:
    "Consult with the best General Physicians and Internal Medicine specialists. Book appointments online, view doctor profiles, fees, and available time slots.",
  keywords: "general physician, internal medicine, doctor consultation, online doctor, apollo 247, medical specialists",
  openGraph: {
    title: "General Physician & Internal Medicine Specialists | Apollo 247 Clone",
    description:
      "Consult with the best General Physicians and Internal Medicine specialists. Book appointments online.",
    url: "/specialties/general-physician-internal-medicine",
    siteName: "Apollo 247 Clone",
    images: [
      {
        url: "/images/og-doctors.jpg",
        width: 1200,
        height: 630,
        alt: "General Physicians",
      },
    ],
    type: "website",
  },
}

export default function GeneralPhysicianPage() {
  // Get mock doctors for structured data
  const doctors = getMockDoctors()

  return (
    <main>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">General Physician & Internal Medicine</h1>
        <DoctorsList specialty="General Physician" />
      </div>
      <StructuredData doctors={doctors} />
    </main>
  )
}
