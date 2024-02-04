const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/database');
const cors = require('cors');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const passport = require('passport');
const session = require("express-session");
const GithubStrategy = require("passport-github2").Strategy;
const dotenv = require("dotenv").config();

// PORTS
const port = process.env.PORT || 8080;

/* 
* NOTE: The bodyParser has to be BEFORE the require routes
*/
app.use(bodyParser.json());

// Init express session initialization 
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}));

// Init password in every route call
app.use(passport.initialize());

// Allow passport to use express-session
app.use(passport.session());

/* 
* Require routes
*/
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "+");
    res.setHeader("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept, Z-Key");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use('/', require('./routes'));

// Root route 
app.use("/", require("./routes"));

passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
function(acessToken, refreshToken, profile, done) {
    return done(null, profile);
}
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get("/", (req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged out")});

app.get("/github/callback", passport.authenticate("github", {
    failureRedirect: "/api-docs", session: false}),
    (req, res) => {
        req.session.user = req.user;
        res.redirect("/");
    });

// Error Handle Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    // Determines the status code and response message according to the type of error
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || "Internal Server Error";

    res.status(statusCode).json({ error: errorMessage });
});


mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {console.log(`Database is listening and node running on port ${port}`)});
    }
});