const mongodb = require('../db/database');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    //#swagger.tags=["Users"]
    try {
        //#swagger.tags=["Users"]
        const response = await mongodb.getDatabase().db().collection("users").find();
        response.toArray().then((users) => {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json(users);
        });
    } catch (error) {
        console.error("ERROR :", error)
        res.status(500).json({ error: "An error occurred. Please, try again." });
    }
};

const getSingleUser = async (req, res) => {
    //#swagger.tags=["Users"]
    try {
        const userId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection("users").find({ _id: userId });
        response.toArray().then((users) => {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json(users[0]);
        });
    } catch (error) {
        console.error("ERROR :", error)
        res.status(500).json({ error: "An error occurred. Please, try again." });
    }
};

const createUser = async (req, res) => {
    //#swagger.tags=["Users"]
    
    const password = req.body.password;
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword, // Place in the object the hashed password
        };

        const response = await mongodb.getDatabase().db().collection("users").insertOne(user);

        if (response.acknowledged > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || "Some error occurred while creating the user.");
        }
    } catch (error) {
        console.error("Error hashing password:", error);
        res.status(500).json({ error: "An error occurred. Please, try again." })
    }
};

const updateUserData = async (req, res) => {
    //#swagger.tags=["Users"]
    const userId = new ObjectId(req.params.id);

    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
    };

    try {
        const response = await mongodb.getDatabase().db().collection("users").updateOne({ _id: userId }, {$set: user});

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || "Some error ocurred while updating the task.");
        }
    } catch (error) {
        console.error("ERROR :", error)
        res.status(500).json({ error: "An error occurred. Please, try again." });
    }
};

const deleteUser = async (req, res) => {
    //#swagger.tags=["Users"]

    const userId = new ObjectId(req.params.id);
    try {
        const response = await mongodb.getDatabase().db().collection("users").deleteOne({ _id: userId });

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || "Some error ocurred while deleting the task.");
        }
    } catch (error) {
        console.error("ERROR :", error)
        res.status(500).json({ error: "An error occurred. Please, try again." });
    }
}

module.exports = { getAllUsers, getSingleUser, createUser, updateUserData, deleteUser };