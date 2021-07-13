import express from "express";
import { recommended } from "../controllers/videoController";
import { join } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/", recommended);
globalRouter.get("/join", join);

export default globalRouter;