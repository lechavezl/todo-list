const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/database');
const cors = require('cors');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

// PORTS
const port = process.env.PORT || 8080;

/* 
* NOTE: The bodyParser has to be BEFORE the require routes
*/
app.use(bodyParser.json());

/* 
* Require routes
*/
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "+");
    res.setHeader("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept, Z-Key");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.use("/", require("./routes"));

app
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use('/', require('./routes'));

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