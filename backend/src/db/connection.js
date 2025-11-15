import mongoose from "mongoose";

export async function connectDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    // Check if using placeholder URI
    if (mongoUri.includes('username:password') || mongoUri.includes('cluster.mongodb.net/database')) {
      console.error("❌ MongoDB connection failed: Please update MONGODB_URI in .env file");
      console.log("\n📝 To fix this:");
      console.log("1. Go to https://www.mongodb.com/cloud/atlas");
      console.log("2. Create a free cluster");
      console.log("3. Get your connection string");
      console.log("4. Update MONGODB_URI in backend/.env\n");
      console.log("OR use local MongoDB:");
      console.log("   MONGODB_URI=mongodb://localhost:27017/lumiq\n");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);

    console.log("✅ MongoDB connected successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);
    return mongoose;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
      console.log("\n💡 Connection string appears to be invalid.");
      console.log("Make sure your MONGODB_URI in .env is correct.\n");
    }
    
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  try {
    await mongoose.connection.close();
    console.log("✅ MongoDB disconnected successfully");
  } catch (error) {
    console.error("❌ MongoDB disconnection failed:", error.message);
  }
}

export default mongoose;
