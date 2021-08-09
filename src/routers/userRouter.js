import express from "express";
import { getEdit, postEdit, logout, see, startGithubLogin, finishGithubLogin, getChangePassword, postChangePassword } from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware, uploadFiles } from "../middlewares";
const userRouter = express.Router();

userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(uploadFiles.single("avatar"), postEdit);
userRouter.get("/logout", protectorMiddleware, logout);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.route("/change_password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get(":id(\\d+)", see);


export default userRouter;