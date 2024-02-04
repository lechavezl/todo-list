const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validationUsers = require("../utilities/users-validation");
const utilities = require("../utilities/index");
const authenticate = require("../utilities/authenticate");

// Route to get all Users
router.get("/", utilities.handleErrors(userController.getAllUsers));

// Route to get a single user
router.get("/:id", utilities.handleErrors(userController.getSingleUser));

// Route to create a new user account
router.post("/",
    authenticate.isAuthenticated,
    validationUsers.usersRules(),
    validationUsers.checkUsersData,
    utilities.handleErrors(userController.createUser)
);

// Route to update an user account
router.put("/:id",
    authenticate.isAuthenticated,
    validationUsers.updateUsersRules(),
    validationUsers.checkUsersData,
    utilities.handleErrors(userController.updateUserData)
);

// Route to delete an user account
router.delete("/:id",
    authenticate.isAuthenticated,
    utilities.handleErrors(userController.deleteUser,
));

module.exports = router;