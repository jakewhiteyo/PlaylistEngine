import express from "express";
import router from "./routes/routes";
import dotenv from "dotenv";


dotenv.config();

const app = express();

app.use(express.json());
app.use("/api", router);

export default app;
