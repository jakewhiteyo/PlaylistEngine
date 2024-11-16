import express from "express";
import router from "./routes/routes";
import dotenv from "dotenv";
import { setupSwagger } from './swagger';


dotenv.config();

const app = express();

setupSwagger(app);

app.use(express.json());
app.use("/api", router);

export default app;
