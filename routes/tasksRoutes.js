const express = require('express');
const router = express.Router();
const controllerTasks = require('../controllers/tasksController');
const validateTasks = require("../utilities/tasks-validation");
const utilities = require("../utilities/index")
const authenticate = require("../utilities/authenticate");

// Route to get all Tasks
router.get("/", utilities.handleErrors(controllerTasks.getAllTasks));

// Route to get a single task
router.get("/:id", utilities.handleErrors(controllerTasks.getSingleTask)
);

// Route to create task
router.post("/",
    authenticate.isAuthenticated,
    validateTasks.TasksRules(),
    validateTasks.checkCreateTaskData,
    utilities.handleErrors(controllerTasks.createTask)
);

// Route to update a task
router.put("/:id",
    authenticate.isAuthenticated,
    validateTasks.TasksRules(),
    validateTasks.checkCreateTaskData,
    utilities.handleErrors(controllerTasks.updateTask)
);

// Route to delete a task
router.delete("/:id",
    authenticate.isAuthenticated,
    utilities.handleErrors(controllerTasks.deleteTask
));

module.exports = router;