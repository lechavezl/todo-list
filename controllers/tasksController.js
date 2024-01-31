const mongodb = require('../db/database');
const ObjectId = require('mongodb').ObjectId;


const getAllTasks = async (req, res) => {
    //#swagger.tags=["Tasks"]

    try {
        const result = await mongodb.getDatabase().db().collection("todolist").find();
        result.toArray().then((todolist) => {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json(todolist);
        });
    } catch (error) {
        console.error("ERROR :", error)
        res.status(500).json({ error: "An error occurred. Please, try again." });
    }
    
};

const getSingleTask = async (req, res) => {
    //#swagger.tags=["Tasks"]

    try {
        const taskId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection("todolist").find({ _id: taskId });
        result.toArray().then((todolist) => {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json(todolist[0]);
        });
    } catch (error) {
        console.error("ERROR :", error)
        res.status(500).json({ error: "An error occurred. Please, try again." });
    }
};

const createTask = async (req, res) => {
    //#swagger.tags=["Tasks"]
    
    const task = {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        due_date: req.body.due_date,
        created_at: req.body.created_at,
        assigned_user: req.body.assigned_user,
        priority: req.body.priority
    };
    
    try {
        const response = await mongodb.getDatabase().db().collection("todolist").insertOne(task);

        if (response.acknowledged > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || "Some error ocurred while creating the task.");
        }
    } catch (error) {
        console.error("ERROR :", error)
        res.status(500).json({ error: "An error occurred. Please, try again." });
    }
};

const updateTask = async (req, res) => {
    //#swagger.tags=["Tasks"]

    const taskId = new ObjectId(req.params.id);

    const task = {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        due_date: req.body.due_date,
        created_at: req.body.created_at,
        assigned_user: req.body.assigned_user,
        priority: req.body.priority
    };
    
    try {
        const response = await mongodb.getDatabase().db().collection("todolist").replaceOne({ _id: taskId }, task);

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

const deleteTask = async (req, res) => {
    //#swagger.tags=["Tasks"]

    const taskId = new ObjectId(req.params.id);

    try {
        const response = await mongodb.getDatabase().db().collection("todolist").deleteOne({ _id: taskId });

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


module.exports = {getAllTasks, getSingleTask, createTask, updateTask, deleteTask};