import connectDB from "../lib/db"; // Import the database connection function
import Doctor from "../lib/models/doctorModel"; // Import the Doctor model
import { getMockDoctors } from "../lib/mock-data"; // Import the mock data function

async function seedDatabase() {
  try {
    // Connect to the database
    await connectDB();
    console.log("Connected to the database.");

    // Clear the existing data in the Doctor collection
    await Doctor.deleteMany({});
    console.log("Cleared existing data in the Doctor collection.");

    // Get mock data
    const mockDoctors = getMockDoctors();

    // Insert mock data into the Doctor collection
    await Doctor.insertMany(mockDoctors);
    console.log("Mock data inserted successfully.");

    process.exit(0); // Exit the script
  } catch (error) {
    console.error("Error seeding the database:", error);
    process.exit(1); // Exit with failure
  }
}

seedDatabase();