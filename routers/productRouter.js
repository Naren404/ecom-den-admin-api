import express from "express";
import { createProduct, deleteproductImage, getProduct, getProducts, updateproduct } from "../models/product/productModel.js";
import { buildErrorResponse, buildSuccessResponse } from "../utility/responseHelper.js";
import { productImageUploader } from "../middlewares/imageUploaders/productImageUploader.js";
import slugify from "slugify";

const productRouter = express.Router()
//PUBLIC ROUTE

// GET A PRODUCT
productRouter.get("/:_id", async(req, res) => {
  try {
    const product = await getProduct(req.params._id)

    product?._id
      ? buildSuccessResponse(res, product, "Product")
      : buildErrorResponse(res, "Could not fetch data")
  } catch (error) {
    buildErrorResponse(res, "Could not fetch data")
  }
})

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

productRouter.patch("/productImages", productImageUploader.array("images", 5), async(req, res) => {
  try {
    if(!req.files?.length) {
      return buildErrorResponse(res, "Could not add product images!")
    }
    
    // get the file path where it was uploaded and store inthe db
    req.body.images = req.files.map((item) => item.path.slice(6)); 

    const product = await updateproduct({ _id: req.body?._id, images: req.body.images })

    product?._id
      ? buildSuccessResponse(res, product, "Product Images added Successfully.")
      : buildErrorResponse(res, "Could not add product images!")
  } catch (error) {
    console.log("Error", error.message);
  }
})

// DELETE PRODUCT IMAGES
// DELETE PRODUCT IMAGE
productRouter.patch("/productImage", async(req, res) => {
  try {
    const {_id, image} = req.body
    const product = await deleteproductImage(_id, image)

    product?._id
      ? buildSuccessResponse(res, product, "Product Images deleted Successfully.")
      : buildErrorResponse(res, "Could not delete product images!")
  } catch (error) {
    console.log("Error", error.message);
  }
})

export default productRouter