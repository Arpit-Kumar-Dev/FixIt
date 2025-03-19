const express = require("express")

const fileUpload = require('express-fileupload');
const { signupUser,loginSP,get_all_service_providers} = require("../controllers/Serviceprovider.controllers")
const router = express.Router()
router.use(fileUpload()); 
router.route("/singup").post(signupUser)
router.route("/login").post(loginSP)
router.route("/get_SP").get(get_all_service_providers)

module.exports = router