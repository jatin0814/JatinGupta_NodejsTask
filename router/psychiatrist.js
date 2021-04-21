const express = require("express")
const { body } = require("express-validator/check");
const psychiatristController = require("../controllers/psychiatrist")

const route = express.Router()


route.post("/login",psychiatristController.login)

route.post("/register",body("firstname").isLength({max:20}),
body("lastname").isLength({max:20}),
psychiatristController.regPsychiatrist
)

module.exports = route;