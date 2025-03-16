const express = require("express")

const fileUpload = require('express-fileupload');
const { getAllUsers, signupUser, loginUser, getUsers} = require("../controllers/User.controllers");

 
const router = express.Router()

//end points
// base url/api/v1/signup reg new user
// base url/api/v1/login log in reg user with token 
// base url/api/v1/all_users get
router.use(fileUpload()); 
router.route("/signup").post(signupUser)
router.route("/login").post(loginUser)
router.route("/all_users").get(getAllUsers)
router.route("/users").post(getUsers)

module.exports = router 