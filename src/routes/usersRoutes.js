const express = require("express");
const UserEndpoints = require("../endpoints/usersEndpoints");
const router = express.Router();

// Getting all
router.route("/getAllUsers").get(UserEndpoints.getAllUsers);

// Getting one
router.route("/getAUser/:id").get(UserEndpoints.getAUser);

// Creating one
router.route("/AddAUser").post(UserEndpoints.AddAUser);

// Deleting one
router.route("/deleteAUser/:id").delete(UserEndpoints.deleteAUser);

module.exports = router;
