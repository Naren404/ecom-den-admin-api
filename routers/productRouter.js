import express from "express";
import { createProduct, getProducts, updateproduct } from "../models/product/productModel.js";
import { buildErrorResponse, buildSuccessResponse } from "../utility/responseHelper.js";
import { productImageUploader } from "../middlewares/imageUploaders/productImageUploader.js";
import slugify from "slugify";

const productRouter = express.Router()
//PUBLIC ROUTE

// GET ALL PRODUCTS
productRouter.get("/", async(req, res) => {
  try {
    const products = await getProducts()

    products?.length
      ? buildSuccessResponse(res, products, "Products")
      : buildErrorResponse(res, "Could not fetch data")
  } catch (error) {
    buildErrorResponse(res, "Could not fetch data")
  }
})

// PRIVATE ROUTE
productRouter.post("/", productImageUploader.single("image"),async(req, res) => {
  try {
    // get the file path where it was uploaded and store inthe db
    if(req.file) {
      req.body.thumbnail = req.file.path.slice(6) 
    }

    // CREATE A SLUG
    req.body.slug = slugify(req.body.name, {
      lower: true,
      trim: true,
    })

    const product = await createProduct(req.body)

    product?._id
      ? buildSuccessResponse(res, product, "Product Created Successfully.")
      : buildErrorResponse(res, "Could not create the product!")
  } catch (error) {
    buildErrorResponse(res, "Could not create the product!")
  }
})

// UPDATE
productRouter.patch("/", productImageUploader.single("image"), async(req, res) => {
  try {
    // get the file path where it was uploaded and store inthe db
    if(req.file) {
      req.body.thumbnail = req.file.path.slice(6) 
    }
    
    const { thumbnail, ...filteredBody } = req.body;

    const updatedProduct = req.file ? req.body : filteredBody

    const product = await updateproduct(updatedProduct)

    product?._id
      ? buildSuccessResponse(res, product, "Product Updated Successfully.")
      : buildErrorResponse(res, "Could not update the product!")
  } catch (error) {
    console.log("Error", error.message);
  }
})

export default productRouter