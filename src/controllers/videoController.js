const fakeUser = {
    username: "Jongwon",
    loggedIn: true,
};

export const recommended = (req, res) => {
    const videos = [
        {
            title: 'First Video',
            rating: 5,
            comments: 2,
            createdAt: "2 months ago",
            views: 59,
            id: 1
        },
        {
            title: 'Second Video',
            rating: 5,
            comments: 2,
            createdAt: "2 months ago",
            views: 59,
            id: 2
        },
        {
            title: 'Third Video',
            rating: 5,
            comments: 2,
            createdAt: "2 months ago",
            views: 59,
            id: 3
        }
    ];
    return res.render("home", {pageTitle: "Home", fakeUser: fakeUser, videos });
}
export const search = (req, res) => res.send("Search Video");

export const see = (req, res) => res.render("watch", {pageTitle: "Watch"});
export const edit = (req, res) => res.render("edit", {pageTitle: "Edit"});
export const remove = (req, res) => res.render("remove", {pageTitle: "Remove"});
export const upload = (req, res) => res.send("Upload Video");
