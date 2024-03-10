import "dotenv/config"
import mongoose from "mongoose";
import { connectToMongoDb } from "../config/dbConfig.js";
import { createUser, findUserByEmail } from "../models/user/userModel.js";
import { hashPassword } from "../utility/bcryptHelper.js";

const seedAdminUser = async() => {
  // CONECT TO DB
  connectToMongoDb()

  // DEFINE| PREPARE USER OBJECT
  const userObject = {
    isVerified: true,
    role: "admin",
    firstName: "EcomDen",
    lastName: "Admin",
    email: "admin@mail.com",
    phone: "0416123123",
    address: "Street 1, Sydney",
  }

  // CHECK IF USER WITH THIS EMAIL EXISTS
  const existingUser = await findUserByEmail(userObject.email)

  if(existingUser){
    throw "User already exist"
  }
  
  if(!existingUser){
    // hash password
    const password = hashPassword("strongPassword")

    // CREATE USER
    const user = await createUser({ ...userObject, password })
  }

  // DISCONNECT OUR DB
  mongoose.disconnect();
}

// EXecute the admin seeder
seedAdminUser()
  .then(() => {
    console.log("Admin user seeded to Db.");
    process.exit(0)
  })
  .catch((error) => {
    console.log("Error seesidg Db.", error);
    process.exit(1)
  })