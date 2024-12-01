import express from "express";
import cors from "cors";
import router from "./routes/routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only your frontend URL
  })
);

app.use(express.json());
app.use("/api", router);

export default app;
