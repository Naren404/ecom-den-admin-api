import productSchema from "./productSchema.js";

// GET PRODUCT BY ID
export const getProduct = (_id) => {
  return productSchema.findById(_id)
}

// GET ALL PRODUCTS
export const getProducts = () => {
  return productSchema.find()
}

// CREATE A PRODUCT
export const createProduct = (productObj) => {
  return productSchema(productObj).save();
};

// UPDATE
export const updateproduct = (updatedObject) => {
  return productSchema.findByIdAndUpdate(updatedObject?._id, updatedObject, { new: true });
};

// DELETE
export const deleteproduct = (_id) => {
  return productSchema.findByIdAndDelete(_id);
};

// DELETE PRODUCT IMAGE
export const deleteproductImage = (_id, image) => {
  return productSchema.findOneAndUpdate(
    {_id: _id},
    { $pull: { images: image } },
    { new: true }
  );
};