export const recommended = (req, res) => res.render("home", {pageTitle: "Home"});
export const search = (req, res) => res.send("Search Video");

export const see = (req, res) => res.render("watch", {pageTitle: "Watch"});
export const edit = (req, res) => res.render("edit", {pageTitle: "Edit"});
export const remove = (req, res) => res.render("remove", {pageTitle: "Remove"});
export const upload = (req, res) => res.send("Upload Video");
