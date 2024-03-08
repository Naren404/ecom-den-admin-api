import categorySchema from "./categorySchema.js";

// GET ALL CATEGORIES
export const getCategories = () => {
  return categorySchema.find()
}

// CREATE A CATEGORY
export const createCategory = (categoryObj) => {
  return categorySchema(categoryObj).save();
};

// UPDATE
export const updateCategory = (updatedObject) => {
  return categorySchema.findByIdAndUpdate(updatedObject?._id, updatedObject, { new: true });
};

// DELETE
export const deleteCategory = (_id) => {
  return categorySchema.findByIdAndDelete(_id);
};