const { body, validationResult } = require("express-validator");
const mongodb = require("../db/database");
const usersController = require("../controllers/userController");

/*  **********************************
 *  Create Users Validation Rules
 * ********************************* */
const usersRules = () => {
    return [
        body("firstName")
            .trim()
            .notEmpty()
            // .isLength({ min: 2})
            .withMessage("Not a valid First Name."),
        
        body("lastName")
            .trim()
            .notEmpty()
            // .isLength({ min: 2})
            .withMessage("Not a valid Last Name."),
        
        body("email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("Not a valid email"),
        
        body("password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
              })
            .withMessage("Password does not meet requirements."),
    ]
};

const updateUsersRules = () => {
    return [
        body("firstName")
            .trim()
            .notEmpty()
            // .isLength({ min: 2})
            .withMessage("Not a valid First Name."),
        
        body("lastName")
            .trim()
            .notEmpty()
            // .isLength({ min: 2})
            .withMessage("Not a valid Last Name."),
        
        body("email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("Not a valid email"),
    ]
};

/*  **********************************
 *  Check if there are errors or continue
 *  Creating or updating the user account
 * ********************************* */
const checkUsersData = (req, res, next) => {
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
        return next()
    };

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }))

    // return res.send(errors.array())
    return res.status(422).json({ errors: extractedErrors });
};

module.exports = { usersRules, updateUsersRules, checkUsersData }