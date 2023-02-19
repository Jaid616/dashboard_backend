const express = require("express")
const Router = express.Router();
const {registerUser,loginUser,userData,changePassword,auth,logout,sendmail} = require("../controllers/UserController")
const checkUserAuth = require("../middleware/auth")

Router.use("/dashboard",checkUserAuth)
Router.use("/changepassword",checkUserAuth)
Router.use("/auth",checkUserAuth)
Router.use("/logout",checkUserAuth)

Router.post("/api/user/registraion",registerUser )

Router.post("/api/user/login" ,loginUser)

Router.get("/auth" ,auth)

Router.post("/logout",logout)

Router.get("/dashboard",userData)

Router.post("/changepassword",changePassword)
Router.post("/sendmail",sendmail)

module.exports = Router ;