import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import wellfoundRouter from "./wellfound/index";
import userRouter from "./user/route";
import { connectDB } from "./db/db";
app.use("/wellfound", wellfoundRouter);
app.use("/user", userRouter);
app.get("/healthy", (req, res) => {
  res.status(200).json({ message: "server is healthy" });
});

app.listen(3001, () => {
  console.log("uri ", process.env.MONGO_URL);
  connectDB();
  console.log("hello");
});
