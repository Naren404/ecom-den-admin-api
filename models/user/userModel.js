import userSchema from "./userSchema.js";

//This file talks to database | table

// create a user
export const createUser = (userObj) => {
  return userSchema(userObj).save();
}

// Find user by email
export const findUserByEmail = (email) => {
  return userSchema.findOne({ email })
}

// Find user by Id
export const findUserById = (id) => {
  return userSchema.findById(id)
}

// Update User
export const updateUser = (filter, updatedUser) => {
  return userSchema.findOneAndUpdate(filter, updatedUser, { new: true });
};
