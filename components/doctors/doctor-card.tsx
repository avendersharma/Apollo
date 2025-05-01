import Image from "next/image"
import { Star, ThumbsUp, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Doctor } from "@/lib/models/doctor"

interface DoctorCardProps {
  doctor: Doctor
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row">
          {/* Doctor Image and Basic Info */}
          <div className="flex flex-col items-center md:items-start md:flex-row md:w-2/3">
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
              <Image
                src={doctor.image || `/placeholder.svg?height=96&width=96&query=doctor ${doctor.gender}`}
                alt={doctor.name}
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800">{doctor.name}</h2>
              <p className="text-gray-600 mb-1">{doctor.specialty}</p>
              <p className="text-gray-600 mb-2">{doctor.experience} years experience</p>

              <div className="flex items-center mb-2">
                <div className="flex items-center bg-green-100 text-green-800 px-2 py-0.5 rounded mr-3">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  <span className="text-sm font-medium">{doctor.rating}</span>
                </div>
                <span className="text-sm text-gray-600">{doctor.reviewCount} Patient Stories</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {doctor.education.slice(0, 2).map((edu, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {edu}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <ThumbsUp className="h-4 w-4 mr-1 text-blue-600" />
                <span>{doctor.hospital}</span>
              </div>
            </div>
          </div>

          {/* Appointment and Fees Info */}
          <div className="mt-4 md:mt-0 md:w-1/3 md:border-l md:pl-6 flex flex-col">
            <div className="mb-4">
              <p className="text-gray-600 mb-1">Consultation Fee</p>
              <p className="text-xl font-bold text-gray-800">₹{doctor.fees}</p>
            </div>

            <div className="mb-4">
              <p className="flex items-center text-sm text-gray-600 mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  Available {doctor.availability.today ? "Today" : doctor.availability.tomorrow ? "Tomorrow" : "Soon"}
                </span>
              </p>

              {(doctor.availability.today || doctor.availability.tomorrow) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {doctor.availability.slots.slice(0, 3).map((slot, index) => (
                    <Badge key={index} variant="outline" className="text-xs flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {slot}
                    </Badge>
                  ))}
                  {doctor.availability.slots.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{doctor.availability.slots.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <div className="mt-auto">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Book Appointment</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
