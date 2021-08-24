import express from "express";
import morgan from "morgan";
import flash from "express-flash";
import session from "express-session"
import MongoStore from "connect-mongo";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import rootRouter from "./routers/rootRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store:MongoStore.create({mongoUrl:process.env.DB_URL}),
    cookie: {
        maxAge: 3600000,
    }
}));

app.use(flash());
app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use("/convert", express.static("node_modules/@ffmpeg/core/dist"));
app.use((req, res, next) => {
    res.header(
        "Cross-Origin-Embedder-Policy", "require-corp",
        "Cross-Origin-Opener-Policy", "same-origin");
    next();
});
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;