export interface Doctor {
  id: string
  name: string
  specialty: string
  experience: number
  location: string
  hospital: string
  education: string[]
  languages: string[]
  fees: number
  rating: number
  reviewCount: number
  availability: {
    today: boolean
    tomorrow: boolean
    slots: string[]
  }
  image: string
  gender: "male" | "female" | "other"
}

export interface DoctorFilters {
  specialty?: string
  gender?: string
  experience?: number
  availability?: string
  location?: string
  language?: string
  sortBy?: "experience" | "rating" | "fees"
  page?: number
  limit?: number
}
