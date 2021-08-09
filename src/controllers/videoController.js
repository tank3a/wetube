import Video from "../models/Video";

export const home = async(req, res) => {
    try {
        const videos = await Video.find({}).sort({createdAt:"desc"});
        return res.render("home", {pageTitle: "Home", videos});
    } catch {
        return res.render();
    }
}
export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video) {
        return res.status(404).render("404", {pageTitle:"Video Not Found"});
    } 
    return res.render("videos/watch", {pageTitle: video.title, video});
};
export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video) {
        return res.status(404).render("404", {pageTitle:"Video Not Found"});
    } 
    return res.render("videos/edit", {pageTitle: `Editing ${video.title}`, video});
};
export const postEdit = async (req, res) => {
    const { id } = req.params;
    const {title, description, hashtags} = req.body;
    if(!Video.exists({_id:id})) {
        return res.status(404).render("404", {pageTitle:"Video Not Found"});
    }
    await Video.findByIdAndUpdate(id, {
        title, description, hashtags: Video.formatHashtags(hashtags),
    })
    return res.redirect(`videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("videos/upload", {pageTitle: "Upload Video"});
};
export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body;
    try {
        await Video.create({
            title,
            description,
            hashtags: Video.formatHashtags(hashtags),
        });
        return res.redirect("/");
    } catch(error) {
        console.log(error);
        return res.status(400).render("videos/upload", {pageTitle: "Upload Video", errorMessage:error._message, });
    }
};

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
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