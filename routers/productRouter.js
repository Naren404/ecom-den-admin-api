import express from "express";
import { getProducts } from "../models/product/productModel.js";
import { buildErrorResponse, buildSuccessResponse } from "../utility/responseHelper.js";

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

export default productRouter