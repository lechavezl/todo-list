const router = require('express').Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger-output.json");
const utilities = require("../utilities/index");
const passport = require('passport');

// Swagger routes
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

// // Main route response
// router.get("/", (req, res) => {
//     //#swagger.tags=["Luis Chavez Project 1"]
//     res.send("Luis Chavez Personal API");
// });

// Route to use all contacts routes
router.use("/tasks", utilities.handleErrors(require("./tasksRoutes")));

// Route to use all users routes
router.use("/users", utilities.handleErrors(require("./userRoutes")));


// Authentication (OAuth) route (log in / logout)
router.get("/login", passport.authenticate("github"), (req, res) => {
    //#swagger.tags=["OAuth"]
});

router.get("/logout", function(req, res, next) {
    //#swagger.tags=["OAuth"]
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect("/");
    })
});
/*
* DOCUMENTATION URL
*/
// routes.use(
//     '/',
//     (docData = (req, res) => {
//       let docData = {
//         documentationURL: 'https://nathanbirch.github.io/nathan-byui-api-docs',
//       };
//       res.send(docData);
//     })
//   );

module.exports = router;