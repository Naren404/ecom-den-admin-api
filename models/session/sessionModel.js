import sessionSchema from "./sessionSchema.js";

//Create
export const createSession = (sessionObj) => {
  return sessionSchema(sessionObj).save();
};

//read @filter must be an object
export const getSession = (filter) => {
  return sessionSchema.findOne(filter);
};

//delete
export const deleteSession = (filter) => {
  return sessionSchema.findOneAndDelete(filter);
};
