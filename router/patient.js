const express = require("express")
const { body } = require("express-validator/check");
const patientController = require("../controllers/patient")
const isAuth = require('../middleware/is-auth')

const route = express.Router()

route.get("/",isAuth,patientController.getPatients)
route.get("/stats",isAuth,patientController.getStats)
route.post("/login",isAuth,patientController.login)
route.post("/register",patientController.registerPatient)
route.post("/edit/:id",isAuth,patientController.editPatient)

module.exports = route;