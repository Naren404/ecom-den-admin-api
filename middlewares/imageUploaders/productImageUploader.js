import multer from "multer"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let error = null
    // Validation Tests
    cb(error, "public/images/product")
  },
  filename: (req, file, cb) => {
    let error = "";
    // construct the unique file name
    const fullFileName = Date.now() + "-" + file.originalname;
    cb(error, fullFileName);
  }
})

export const productImageUploader = multer({ storage })