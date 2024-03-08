import express from "express";
import { adminAuth } from "../middlewares/authMiddleware/authMiddleware.js";
import { categoryImageUploader } from "../middlewares/imageUploaders/categoryImageUplaoder.js";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../models/category/categoryModel.js";
import { buildErrorResponse, buildSuccessResponse } from "../utility/responseHelper.js";

const categoryRouter = express.Router()
// PUBLIC ROUTES

// GET ALL CATEGORIES
categoryRouter.get("/", async(req, res) => {
  try {
    const categories = await getCategories()

    categories?.length
      ? buildSuccessResponse(res, categories, "Categories")
      : buildErrorResponse(res, "Could not fetch data")
  } catch (error) {
    buildErrorResponse(res, "Could not fetch data")
  }
})

// PRIVATE ROUTE

// CREATE CATEGORY
categoryRouter.post("/", categoryImageUploader.single("image"), async(req, res) => {
  try {
    // get the file path from uploaded files | image
    // it can be obtained in req.file
    if(req.file) {
      req.body.thumbnail = req.file.path.slice(6)

      const category = await createCategory(req.body)

      return category?._id
        ? buildSuccessResponse(res, category, "Category creaetd successfully")
        : buildErrorResponse(res, "Could not create category.")
    }

    buildErrorResponse(res, "Could not create category.")
  } catch (error) {
    return buildErrorResponse(res, "Could not create category.")
  }
})

// UPDATE
categoryRouter.patch("/", categoryImageUploader.single("image"), async(req, res) => {
  try {
    // get the file path where it was uploaded and store inthe db
    if(req.file) {
      req.body.thumbnail = req.file.path.slice(6) 
    }

    const updatedCategory = req.file 
                              ? req.body 
                              : {
                                _id: req.body._id,
                                title: req.body.title
                              }

    const category = await updateCategory(updatedCategory)

    category?._id
      ? buildSuccessResponse(res, category, "Category Updated Successfully.")
      : buildErrorResponse(res, "Could not update the category!")
  } catch (error) {
    console.log("Error", error.message);
  }
})

// DELETE
categoryRouter.delete("/:_id", async(req, res) => {
  try {
    const category = await deleteCategory(req.params._id)

    category?._id
      ? buildSuccessResponse(res, category, "Category deleted Successfully.")
      : buildErrorResponse(res, "Could not delete the category!")
  } catch (error) {
    console.log("Error", error.message);
  }
})


export default categoryRouter