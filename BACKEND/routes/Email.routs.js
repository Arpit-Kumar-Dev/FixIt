const express = require("express")
const router = express.Router()
const sendMail = require("../controllers/Email.controllers")
const sendBookingMail = require("../controllers/BookingEmail.controllers")


router.route("/sendMail").post(sendMail)
router.route("/sendBookingMail").post(sendBookingMail)
module.exports = router