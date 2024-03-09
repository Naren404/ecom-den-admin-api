import "dotenv/config"
import express from "express"
import cors from "cors"
import { connectToMongoDb } from "./config/dbConfig.js"

const app = express()
const PORT = process.env.PORT || 8000

// Middlewares
app.use(cors())
app.use(express.json())

// Connect to Database
connectToMongoDb()

// Serve Images
import path from "path";
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/public")));

// Routes
import userRouter from "./routers/userRouter.js"
import categoryRouter from "./routers/categoryRouter.js"
import productRouter from "./routers/productRouter.js"

app.use("/api/user", userRouter)
app.use("/api/category", categoryRouter)
app.use("/api/product", productRouter)
// Run the server
app.listen(PORT, (error) => {
  error ? console.log("Error", error) : console.log("Server is running at port", PORT)
})