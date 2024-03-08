import express from "express";
import { adminAuth } from "../middlewares/authMiddleware/authMiddleware.js";
import { categoryImageUploader } from "../middlewares/imageUploaders/categoryImageUplaoder.js";
import { createCategory } from "../models/category/categoryModel.js";
import { buildErrorResponse, buildSuccessResponse } from "../utility/responseHelper.js";

const categoryRouter = express.Router()

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

export default categoryRouter