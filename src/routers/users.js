

const express = require('express');
const User = require('../models/user');
const router = new express.Router();





//using PROMISES 
//create user
// router.post('/users', (req, res) => {
//     const user = new User(req.body);
//     user.save().then((savedUser) => {
//         res.send(savedUser);
//     }).catch((error) => {
//         res.status(400).send(error);
//     });
// });



// //get all users
// router.get('/users', (req, res) => {
//     User.find({}).then((users) => {
//         res.send(users);
//     }).catch((error) => {
//         res.status(500).send(error);
//     });
// });


// //get user by id
// router.get('/users/:id', (req, res) => {
//     const _id = req.params.id; //automatically get converted to ObjectID
//     User.findById(_id).then((user) => {
//         if (!user) {
//             return res.send(404).send();
//         }
//         res.send(user);
//     }).catch(() => {
//         res.status(500).send();
//     });
// });







//using ASYNC-AWAIT
//async returns promise , to NODE
//but node never uses it , it uses res/req 
//so its demonstrated below , how to use async and await
//NOTE : await can only be used inside an async method


//create user
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});


//get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send(e);
    }
});


//get user by id
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id; //automatically get converted to ObjectID
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.send(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }
});


router.patch('/users/:id', async (req, res) => {
    const updatesRequested = Object.keys(req.body);
    const updatesAllowed = ['name', 'age', 'password', 'email'];

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
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        //if this id was not present in DB in first place
        if (!user) {
            res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }
});






module.exports = router;