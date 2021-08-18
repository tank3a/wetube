import express from "express";
import { watch, getEdit, postEdit, getUpload, postUpload, deleteVideo } from "../controllers/videoController";
import { protectorMiddleware, uploadVideo } from "../middlewares";

const videoRouter = express.Router();

videoRouter.route("/upload").all(protectorMiddleware).get(getUpload).post(uploadVideo.fields([{name:"video", maxCount:1}, {name:"thumb", maxCount:1}]), postUpload);
videoRouter.get("/:id([a-f0-9]{24})", watch);
videoRouter.route("/:id([a-f0-9]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.route("/:id([a-f0-9]{24})/delete").all(protectorMiddleware).get(deleteVideo);

export default videoRouter;