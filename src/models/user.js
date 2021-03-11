
const validator = require('validator');
const mongoose = require('mongoose');


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
            if (val.toLowerCase().includes('password')) {
                throw new Error('invalid password');
            }
        }
    },

    email: {
        type: String,
        required: true,
        trim:true,
        lowercase:true,
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
    }
});


module.exports = User