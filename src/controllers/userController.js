import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", {pageTitle:"Create Account"});
export const postJoin = async (req, res) => {
    const {name, username, email, password, password2, location } = req.body;
    if(password !== password2) {
        return res.status(400).render("join", {pageTitle:"Join", errorMessage:"Password confirmation does not match"});
    }
    try {
        await User.create({
            name,
            username,
            email,
            password,
            location 
        });
        return res.redirect("/login");
    } catch(error) {
        if(await User.exists({username})) {
            return res.status(400).render("join", {pageTitle:"Join", errorMessage:"Sorry, this username exists"});
        }
        else if(await User.exists({email})) {
            return res.status(400).render("join", {pageTitle:"Join", errorMessage:"This Email is already taken"});
        }
        else {
            return res.status(404).render("404", {pageTitle:"Cannot Join"});
        }
    }
}

export const getLogin = (req, res) => res.render("login", {pageTitle:"Login"});
export const postLogin = async (req, res) => {
    const {email, password} = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({email});
    if(!user) {
        return res.status(400).render("login", {pageTitle, errorMessage:"An account with this email does not exist"});
    }
    const success = await bcrypt.compare(password, user.password);
    if(!success) {
        return res.status(400).render("login", {pageTitle, errorMessage:"Wrong password"});
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: "7831613d98214c626458",
        allow_signup : false,
        scope:"read:user user:email",
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;

    return res.redirect(finalUrl);
};
export const finishGithubLogin = (req, res) => {
    res.end();
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Delete User");
export const logout = (req, res) => res.send("LogOut");
export const see = (req, res) => res.send("See user");
