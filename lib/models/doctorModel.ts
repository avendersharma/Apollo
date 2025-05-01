import mongoose, { Schema } from "mongoose"
import Doctor from "./doctor"

const DoctorSchema = new Schema<Doctor>(
  {
    name: { type: String, required: true },
    specialty: { type: String, required: true, index: true },
    experience: { type: Number, required: true },
    location: { type: String, required: true, index: true },
    hospital: { type: String, required: true },
    education: [{ type: String }],
    languages: [{ type: String, index: true }],
    fees: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    availability: {
      today: { type: Boolean, default: false },
      tomorrow: { type: Boolean, default: false },
      slots: [{ type: String }],
    },
    image: { type: String },
    gender: { type: String, enum: ["male", "female", "other"], index: true },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Doctor || mongoose.model<Doctor>("Doctor", DoctorSchema)
