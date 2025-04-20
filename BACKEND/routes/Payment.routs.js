const express = require("express")
const router = express.Router()
const {MakePayment} = require("../controllers/Payment.controllers")

router.route("/checkout").post(MakePayment)

module.exports = router