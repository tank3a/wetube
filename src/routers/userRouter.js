import express from "express";
import { edit } from "../controllers/userController";
import { remove } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/edit", edit);
userRouter.get("/delete", remove);

export default userRouter;