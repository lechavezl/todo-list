const { body, validationResult } = require("express-validator");
const mongodb = require("../db/database");
const TasksController = require("../controllers/tasksController");

/*  **********************************
 *  Create Tasks Validation Rules
 * ********************************* */
const TasksRules = () => {
    return [
        body("title")
            .trim()
            .notEmpty()
            // .isLength({ min: 2})
            .withMessage("Not a valid title."),
        
        body("description")
            .trim()
            .notEmpty()
            // .isLength({ min: 2})
            .withMessage("Not a valid description."),
        
        body("status")
            .trim()
            .notEmpty()
            .withMessage("Not a valid status"),
        
        body("due_date")
            .trim()
            .notEmpty()
            // .isLength({ min: 2})
            .withMessage("Not a valid due date"),
        
        body("priority")
            .trim()
            .notEmpty()
            // .isLength({ min: 2})
            .withMessage("Not a valid priority status"),
    ]
};

/*  **********************************
 *  Check if there are errors or continue
 *  Creating or updating the new task
 * ********************************* */
const checkCreateTaskData = (req, res, next) => {
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
        return next()
    };

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }))

    // return res.send(errors.array())
    return res.status(422).json({ errors: extractedErrors });
};

module.exports = { TasksRules, checkCreateTaskData }