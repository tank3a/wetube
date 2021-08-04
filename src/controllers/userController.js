import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

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
        client_id: process.env.GH_CLIENT,
        allow_signup : false,
        scope:"read:user user:email",
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;

    return res.redirect(finalUrl);
};
export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";

    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (await fetch(finalUrl, {
        method:"POST",
        headers: {
            Accept: "application/json"
        }
    })).json();
    if("access_token" in tokenRequest) {
        const {access_token} = tokenRequest;
        const apiURL = "https://api.github.com";
        const userData = await (
            await fetch(`${apiURL}/user`, {
            headers: {
                Authorization: `token ${access_token}`,
            }
        })).json();
        const emailData = await (
            await fetch(`${apiURL}/user/emails`, {
            headers: {
                Authorization: `token ${access_token}`,
            }
        })).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if(!emailObj) {
            return res.redirect("/login");
        }
        let user = await User.findOne({email: emailObj.email});
        if(!user) {
            user = await User.create({
                name: userData.name,
                avatarUrl: userData.avatar_url,
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialLogin: true,
                location: userData.location,
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    
    } else {
        return res.redirect("/login");
    }
};
export const edit = (req, res) => res.send("Edit User");
export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
}
export const see = (req, res) => res.send("See user");
