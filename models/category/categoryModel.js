import categorySchema from "./categorySchema.js";

// GET ALL CATEGORIES
export const getCategories = () => {
  return categorySchema.find()
}

// CREATE A CATEGORY
export const createCategory = (categoryObj) => {
  return categorySchema(categoryObj).save();
};