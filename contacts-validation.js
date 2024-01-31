const { body, validationResult } = require("express-validator");
const mongodb = require("../db/database");
const controllerContacts = require("../controllers/controllerContacts");


/*  **********************************
 *  Create Contacts Validation Rules
 * ********************************* */
const createContactRules = () => {
    return [
        body("firstName")
            .trim()
            .notEmpty()
            // .isLength({ min: 2})
            .withMessage("Not a valid First Name"),
        
        body("lastName")
            .trim()
            .notEmpty()
            // .isLength({ min: 2})
            .withMessage("Not a valid Last Name"),
        
        body("email")
            .trim()
            // .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("Not a valid email"),
            // .custom(async (email) => {
            //     const existingContact = await controllerContacts.findContactByEmail(email);
            //     if (existingContact) {
            //         throw new Error("Email already exists");
            //     }
            //     return true;
            // }),
        
        body("favoriteColor")
            .trim()
            .notEmpty()
            // .isLength({ min: 2})
            .withMessage("Not a valid color"),
        
        body("birthday")
            .trim()
            .notEmpty()
            // .isLength({ min: 2})
            .withMessage("Not a valid birthday"),
    ]
};

/*  **********************************
 *  Check if there are errors or continue
 *  Creating the new contact
 * ********************************* */

const checkCreateContactData = (req, res, next) => {
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
        return next()
    };

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }))

    // return res.send(errors.array())
    return res.status(422).json({ errors: extractedErrors });
};

module.exports = { createContactRules, checkCreateContactData }