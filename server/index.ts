import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import wellfoundRouter from "./wellfound/index";
import userRouter from "./user/route";
import { connectDB } from "./db/db";
import cors from "cors";

app.use(cors());

app.use(express.json());
app.use("/wellfound", wellfoundRouter);
app.use("/user", userRouter);
app.get("/healthy", (req, res) => {
  res.status(200).json({ message: "server is healthy" });
});

async function start() {
  await connectDB();
  app.listen(3001, () => {
    console.log("Server listening on http://localhost:3001");
  });
}

start().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
