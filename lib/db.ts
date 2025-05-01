// import mongoose from "mongoose"

// declare global {
//   // Extend the global object with a mongoose property
//   var mongoose: mongoose.Mongoose | undefined;
// }

// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/apollo-clone"

// let cached = global.mongoose

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null }
// }

// async function connectDB() {
//   if (cached.conn) {
//     return cached.conn
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     }

//     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//       return mongoose
//     })
//   }
//   cached.conn = await cached.promise
//   return cached.conn
// }

// export default connectDB


import mongoose from "mongoose";

declare global {
  // Extend the global object with a properly typed mongoose property
  var mongoose: { conn: mongoose.Mongoose | null, promise: Promise<mongoose.Mongoose> | null };
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/apollo-clone";

// Initialize the cached object if it doesn't exist
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn; // Return the existing connection
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Create a new promise and store it in cached.promise
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose; // Return the mongoose instance
    });
  }

  // Wait for the promise to resolve, then set the connection
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
