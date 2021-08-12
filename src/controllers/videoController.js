import Video from "../models/Video";
import User from "../models/User";

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
    const video = await Video.findById(id).populate("owner");
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
        file,
    } = req;
    try {
        const newVideo = await Video.create({
            title,
            description,
            fileUrl: file ? file.path : "",
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
    const video = await Video.exists({_id: id});
    console.log(video);
    if(String(video.owner) !== String(_id)) {
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
        });
    }

    res.render("videos/search", {pageTitle:"Search", videos});
}