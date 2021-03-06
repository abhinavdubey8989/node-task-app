

const express = require('express');
const multer = require('multer');
const sharp = require('sharp');


const { User } = require('../models/user');
const auth = require('../middle-ware/auth');
const user = require('../models/user');

const router = new express.Router();

const MEGA_BYTE = 1000000;


//only login and register route will be public
//rest will need authentication



//*********************using PROMISES START ************************** 
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
//*********************using PROMISES END ************************** 







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


//login route
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});



//logout route : deletes 1 token from db
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(x => {
            return x.token != req.token;
        });

        await req.user.save();
        res.send('logged out!!')
    } catch (e) {
        res.status(400).send(e);
    }
});


//logout route : deletes all tokens from db
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send('logged out of all devices!!')
    } catch (e) {
        res.status(400).send(e);
    }
});


//get all users
//this operation is not allowed in real-app
// router.get('/users', async (req, res) => {
//     try {
//         const users = await User.find({});
//         res.send(users);
//     } catch (e) {
//         res.status(500).send(e);
//     }
// });



//get profile : this is in place of above
//adding auth middle ware
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});


//get user by id
//this is not a valid end point of aur application , as we cannot give details of user by id
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id; //automatically get converted to ObjectID
//     try {
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.send(404).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send(e);
//     }
// });



//we can only update the logged in user , and not any user by id
//so this end point is deprecated , below is the replacement of this route
// router.patch('/users/:id', async (req, res) => {
//     const updatesRequested = Object.keys(req.body);
//     const updatesAllowed = ['name', 'age', 'password', 'email'];

//     let isValid = true;
//     updatesRequested.forEach(requested => {
//         if (!updatesAllowed.includes(requested)) {
//             isValid = false;
//         }
//     });

//     if (!isValid) {
//         return res.status(400).send({ error: 'Invalid update operation' });
//     }

//     try {

//         //if we use the below , the bcypt middle ware used to hasing will not work , as certain queries can by-pass the middleware
//         // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

//         //so bcz of the above reason , we write below 3 lines of code
//         const user = await User.findById(req.params.id);
//         updatesRequested.forEach(feild => user[feild] = req.body[feild]);
//         await user.save();


//         //if this id was not present in DB in first place
//         if (!user) {
//             res.status(404).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send(e);
//     }
// });


router.patch('/users/me', auth, async (req, res) => {
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
        //no need to fetc user from DB , 
        //bcz after auth , user is attached in req
        updatesRequested.forEach(feild => req.user[feild] = req.body[feild]);
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});



//delete logged-in user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});



//for uploading profile pic
const uploadMiddleWare = multer({
    // dest: 'avatars', //we are removing this as we dont want to create a directory to store DP , and this allows us to access file inside the route handler
    limits: {
        fileSize: 1 * MEGA_BYTE
    },

    //method used to filter the files which can be uploaded
    fileFilter(req, file, callback) {
        if (!file.originalname.endsWith('.jpg') && !file.originalname.endsWith('.jpeg') && !file.originalname.endsWith('.png')) {
            return callback(new Error('invalid file extension'));//if invalid file is uploaded
        }
        callback(null, true);//all things went good
        // callback(null, false);//silently reject the upload request
    }
});

//uploadMiddleWare will search for upload key in the request body
//to register error handling , we must provide : error,req,res,next COMPULSARILY like shown below
router.post('/users/me/avatar', auth, uploadMiddleWare.single('upload'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer; //req.file.buffer contains all binary data
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ err: error.message });
});




//delete avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = null;
    await req.user.save();
    res.send();
});



//get avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        console.log(123);
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set("Content-Type", "image/png");//this is sent with every request, in other request expres does it for us , here we are doing manually
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
});



module.exports = router;