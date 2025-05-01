export default function DoctorStructuredData({ doctors }: { doctors: any[] }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Apollo 247 Clone",
    url: "https://apollo-clone.vercel.app/specialties/general-physician-internal-medicine",
    logo: "https://apollo-clone.vercel.app/logo.png",
    description: "Find and book appointments with the best General Physicians and Internal Medicine specialists.",
    telephone: "+91-1234567890",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Health Street",
      addressLocality: "New Delhi",
      addressRegion: "Delhi",
      postalCode: "110001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "28.6139",
      longitude: "77.2090",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    medicalSpecialty: "General Practice",
    availableService: {
      "@type": "MedicalProcedure",
      name: "Online Doctor Consultation",
      procedureType: "http://schema.org/PhysicalExam",
    },
    physician: doctors.map((doctor) => ({
      "@type": "Physician",
      name: doctor.name,
      image: doctor.image,
      medicalSpecialty: doctor.specialty,
      memberOf: {
        "@type": "Hospital",
        name: doctor.hospital,
      },
      availableService: {
        "@type": "MedicalProcedure",
        name: "Online Doctor Consultation",
        procedureType: "http://schema.org/PhysicalExam",
      },
    })),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}
