
const validator = require('validator');
const mongoose = require('mongoose');
//mongoose is and ODM : object document mapping , jut like ORM in SQL

const baseURL = 'mongodb://127.0.0.1:27017/';
const databaseName = 'task-manager-api';
const connectionURL = baseURL + databaseName;
// const collectionName = 'users';//table name


//connecting to DB thru mongoose
mongoose.connect(connectionURL, { useNewUrlParser: true, useCreateIndex: true });

//*************************USER START***************************/
//defining USER model for and using mongoose
//will create a new collection/table , converted to lower case
const User = mongoose.model('User', {
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
            if (val.tolowerCase().include('password')) {
                throw new Error('invalid password');
            }
        }
    },

    email: {
        type: String,
        required: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error('invalid email')
            }
        }
    },

    age: {
        type: Number,
        default: 10,
        validate(value) {
            if (value < 0) {
                throw new Error('Age cannot be a negative number');
            }
        }
    }
});

const user1 = new User({ name: '  user1  ', email: 'abcd@SpeechGrammarList.com', password: 'password@123' });
user1.save().then((savedUser) => {
    console.log(savedUser);
}).catch((error) => {
    console.log(error);
});
//*************************USER END***************************/




//*************************TASK START***************************/
//defining TASK model for and using mongoose
//will create a new collection/table , converted to lower case
// const Task = mongoose.model('Task', {
//     description: {
//         type: String
//     },
//     completed: {
//         type: Boolean
//     }
// });



// const task1 = new Task({ description: 'do project in node.js', completed: false });

// task1.save().then((savedTask) => {
//     console.log(savedTask);
// }).catch((error) => {
//     console.log(error);
// });
//*************************TASK END***************************/
