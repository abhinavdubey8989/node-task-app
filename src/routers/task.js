const express = require('express');
const Task = require('../models/task');
const auth = require('../middle-ware/auth');
const router = new express.Router();


//*********************using PROMISES START ************************** 
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
//*********************using PROMISES END ************************** 




//create task
router.post('/task', auth, async (req, res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});


//get all task of logged in user (not for all users)
//GET /tasks?completed=true
//GET /tasks?limit=10&skip=10  => skip first n records and then fetch the limit number of records
//GET /tasks?sortBy=createdAt:desc  => we split the string using : and then use 1 or -1 based on asc,desc
router.get('/task', auth, async (req, res) => {


    let _match = {};
    let _sort = {};

    if (req.query.completed) {
        _match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        _sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }




    try {

        //option 1 : search by owner id in tasks table
        // const task = await Task.find({owner:req.user._id});
        // res.send(task);

        //option2 : using user model virtual stuff : tasks if the virtual property to be sent as response
        // await req.user.populate('tasks').execPopulate();
        // res.send(req.user.tasks);

        //option3 : the below is used to include the pagination and sorting filter
        await req.user.populate({
            path: 'tasks', //where to populate
            match: _match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: _sort
            }
        }).execPopulate();

        res.send(req.user.tasks);


    } catch (e) {
        res.status(500).send(e);
    }
});


//get task by id
router.get('/task/:id', auth, async (req, res) => {
    const _id = req.params.id; //automatically get converted to ObjectID
    try {
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.send(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});


//update task by id
router.patch('/task/:id', auth, async (req, res) => {
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
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        //if this id was not present in DB in first place
        if (!task) {
            res.status(404).send();
        }
        updatesRequested.forEach((feild) => task[feild] = req.body[feild]);
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});




//delete task by id for a logged in user
router.delete('/task/:id', auth, async (req, res) => {

    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
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