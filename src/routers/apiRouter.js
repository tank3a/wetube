import express from "express";
import { registerView, createComment, deleteComment } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([a-f0-9]{24})/views", registerView);
apiRouter.post("/videos/:id([a-f0-9]{24})/comment", createComment);
apiRouter.delete("/videos/comments/:id([a-f0-9]{24})/delete", deleteComment);

export default apiRouter;