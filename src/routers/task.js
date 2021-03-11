const express = require('express');
const Task = require('../models/task');
const router = new express.Router();


//using PROMISES 
//create task
// router.post('/task', (req, res) => {
//     const task = new Task(req.body);
//     task.save().then((savedTask) => {
//         res.send(savedTask);
//     }).catch((error) => {
//         res.status(400).send(error);
//     });
// });


// //get all task
// router.get('/task', (req, res) => {
//     Task.find({}).then((tasks) => {
//         res.send(tasks);
//     }).catch((error) => {
//         res.status(500).send(error);
//     });
// });


// //get task by id
// router.get('/task/:id', (req, res) => {
//     const _id = req.params.id; //automatically get converted to ObjectID
//     Task.findById(_id).then((task) => {
//         if (!task) {
//             return res.send(404).send();
//         }
//         res.send(task);
//     }).catch(() => {
//         res.status(500).send();
//     });
// });




//create task
router.post('/task', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});


//get all task
router.get('/task', async (req, res) => {
    try {
        const task = await Task.find({});
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});


//get task by id
router.get('/task/:id', async (req, res) => {
    const _id = req.params.id; //automatically get converted to ObjectID
    try {
        const task = await Task.findById(_id);
        if (!task) {
            return res.send(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});


//update task by id
router.patch('/task/:id', async (req, res) => {
    const updatesRequested = Object.keys(req.body);
    const updatesAllowed = ['description', 'completed'];

    let isValid = true;
    updatesRequested.forEach(requested => {
        if (!updatesAllowed.includes(requested)) {
            isValid = false;
        }
    });

    if (!isValid) {
        return res.status(400).send({ error: 'Invalid update operation' });
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        //if this id was not present in DB in first place
        if (!task) {
            res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});




module.exports = router;