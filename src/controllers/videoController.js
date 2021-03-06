import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";

const isHeroku = process.env.NODE_ENV === "production";

export const home = async(req, res) => {
    try {
        const videos = await Video.find({}).sort({createdAt:"desc"}).populate("owner");
        return res.render("home", {pageTitle: "Home", videos});
    } catch {
        return res.render();
    }
}
export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner").populate({path: "comments", model:"Comment", populate: {path: "owner", model:"User"}});
    if(!video) {
        return res.status(404).render("404", {pageTitle:"Video Not Found"});
    }
    return res.render("videos/watch", {pageTitle: video.title, video});
};
export const getEdit = async (req, res) => {
    const {
        params: { id },
        session: { user: {_id}},
     } = req;
    const video = await Video.findById(id);
    if(!video) {
        return res.status(404).render("404", {pageTitle:"Video Not Found"});
    } 
    if(String(video.owner) !== String(_id)) {
        req.flash("error", "Not Authorized");
        return res.status(403).redirect("/");
    }
    return res.render("videos/edit", {pageTitle: `Editing ${video.title}`, video});
};
export const postEdit = async (req, res) => {
    const {
        params: { id },
        body: {title, description, hashtags},
        session: {
            user: { _id },
        },
    } = req;
    const video = await Video.findById(id);
    if(!video) {
        return res.status(404).render("404", {pageTitle:"Video Not Found"});
    }
    if(String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title, description, hashtags: Video.formatHashtags(hashtags),
    })
    
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("videos/upload", {pageTitle: "Upload Video"});
};
export const postUpload = async (req, res) => {
    const {
        session: { user:{_id} },
        body: {title, description, hashtags },
        files: {video, thumb}
    } = req;
    try {
        const newVideo = await Video.create({
            title,
            description,
            fileUrl: isHeroku ? video[0].location : video[0].path,
            thumbUrl: isHeroku ? thumb[0].location : thumb[0].path,
            hashtags: Video.formatHashtags(hashtags),
            owner: _id,
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
    } catch(error) {
        console.log(error);
        return res.status(400).render("videos/upload", {pageTitle: "Upload Video", errorMessage:error._message, });
    }
};

export const deleteVideo = async (req, res) => {
    const {
        params: { id },
        session: { user: {_id}},
    } = req;
    const video = await Video.findById(id);
    console.log(video);
    if(String(video.owner) !== String(_id)) {
        req.flash("error", "Not Authorized");
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
};

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if(keyword) {
        videos = await Video.find({
            title:{
                $regex: new RegExp(keyword, "i"),
            },
        }).populate("owner");
    }
    return res.render("videos/search", {pageTitle:"Search", videos, keyword});
}


export const registerView = async (req, res) => {
    const {
        params: { id },
    } = req;

    const video = await Video.findById(id);
    if(!video) {
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
}

export const createComment = async (req, res) => {
    const {
        params: {id},
        body: {text},
        session: {user},
    } = req;
    try {
        const video = await Video.findById(id);
        const comment = await Comment.create({
            text,
            owner: user._id,
            video: id,
        });
        video.comments.push(comment._id);
        video.save();
        return res.status(201).json({newCommentId: comment._id, avatarUrl: user.avatarUrl});
    } catch {
        return res.sendStatus(404);
    }
    
}

export const deleteComment = async (req, res) => {
    const {
        params: {id},
        session: {user},
    } = req;
    try {
        const comment = await Comment.findById(id);
        if(user._id === String(comment.owner)) {
            await Comment.findByIdAndDelete(id);
            const video = await Video.findById(comment.video);
            video.comments.remove(comment._id);
            video.save();
        }
        return res.sendStatus(200);
    } catch(error) {
        return res.sendStatus(404);
    }
}