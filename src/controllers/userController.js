import User from "../models/User";

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

export const login = (req, res) => res.send("Login");

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Delete User");
export const logout = (req, res) => res.send("LogOut");
export const see = (req, res) => res.send("See user");
