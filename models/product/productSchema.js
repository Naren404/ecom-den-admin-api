import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "active",
    },
    name: {
      type: String,
      required: true,
    },
    parentCategory: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: 1,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    salesPrice: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
    },
    salesStartDate: {
      type: Date,
    },
    salesEndDate: {
      type: Date,
    },
    sku: {
      type: String,
      unique: true,
      index: 1,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
