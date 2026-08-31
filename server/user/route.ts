import express from "express";
import { User } from "../db/user";
const router = express.Router();
import type { UserType } from "../db/user";
import bcrypt from "bcrypt";
import responseSend from "../statusCodes";
import jwt from "jsonwebtoken";
import { validToken } from "../middleware";
router.post("/login", async (req, res) => {
  const payload = req.body;
  if (!payload.email) {
    res.status(400).json({ success: false, message: "enter  a valid email" });
    return;
  }
  try {
    const user = await User.findOne({ email: payload.email });
    if (!user) {
      res.status(400).json({ success: false, message: "user not found" });
      return;
    }
    const passwordcheck = await bcrypt.compare(payload.password, user.password);

    if (!passwordcheck) {
      responseSend(401, res);
      return;
    }
    const token = generatToken(user);
    res.status(200).json({ success: true, token });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
});
router.post("/register", async (req, res) => {
  const payload = req.body;
  if (!payload.email || payload.password) {
    responseSend(401, res);
    return;
  }
  try {
    const userExist = await User.findOne({ email: payload.email });
    if (userExist) {
      responseSend(409, res, "user aleardy exist with this email");
      return;
    }
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const user = await User.create({
      email: payload.email,
      password: hashedPassword,
    });
    const token = generatToken(user);
    res.status(201).json({ success: true, token });
    return;
  } catch (e) {
    console.log(e.message, " in register route");
    responseSend(500, res);
    return;
  }
});

router.get("/me", validToken, async (req, res) => {
  const userid = req.userId;
  if (!userid) {
    responseSend(409, res, "user id not gotten");
    return;
  }

  try {
    const userExist = await User.findById(userid).select("-password");
    res.status(200).json({
      data: userExist,
    });
  } catch (e) {
    responseSend(500, res);
    console.log("error /me", e.message);
  }
});
function generatToken(user: UserType) {
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    },
  );
  return token;
}
export default router;
