
const validator = require('validator');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SIGN_KEY = process.env.SIGN_KEY;
const Task = require('./task');




//to use middleware (which converts plain text password to hashed password)
//we make the schema first and then pass it as 2nd argument to mongoose.model




//provide 2 args : 1st defining schema , 2nd for enabling timestamps
const userSchema = new mongoose.Schema(

    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 7,
            validate(val) {
                if (val.toLowerCase().includes('password')) {
                    throw new Error('invalid password');
                }
            }
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            validate(val) {
                if (!validator.isEmail(val)) {
                    throw new Error('invalid email')
                }
            }
        },

        age: {
            type: Number,
            default: 0,
            validate(value) {
                if (value < 0) {
                    throw new Error('Age cannot be a negative number');
                }
            }
        },

        //list of all token , currently valid for a user
        tokens: [{
            token: {
                type: String,
                required: true

            }
        }],


        //validations are done by multer , and this feild is not required
        avatar: {
            type: Buffer
        }


    },

    {
        timestamps: true

    }

);



//not stored in user's collection ,
//it a way to tell mongoose how users and task are related
//1st agruments : tasks => tells that we can now access user.tasks
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',//what is userId called in user table/collection
    foreignField: 'owner' //what user id is called in Task model

});



//to remove sensitive stuff 
userSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.tokens;
    return userObj;
}



userSchema.methods.generateAuthToken = async function () {
    const user = this;

    //the 1st argument is an object , represents the data embedded in the token , user ID will do for our purposes
    //2nd is a string secret , used to sign the token , to ensure token is not altered
    const token = jwt.sign({ _id: user._id.toString() }, SIGN_KEY);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}


//custom findBy method
//these are avaible on Models , ie : User 
userSchema.statics.findByCredentials = async (uEmail, uPass) => {
    const user = await User.findOne({ email: uEmail });
    //if user not found or password mis-match
    if (!user) {
        throw new Error('Unable to login!');
    }

    const isMatch = await bcryptjs.compare(uPass, user.password);
    if (!isMatch) {
        throw new Error('Unable to login!');
    }

    return user;
}


//middle-ware to hash the password before saving
//since we want to use "this" , we have not use ES6 syntax
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcryptjs.hash(user.password, 8);
    }
    next();
});



//middle-ware to remove all tasks of a user , when user is deleted g
userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
});



const User = mongoose.model('User', userSchema);

module.exports = {
    User: User
}