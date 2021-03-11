


const validator = require('validator');
const mongoose = require('mongoose');


const Task = mongoose.model('Task', {
    description: {
        type: String,
        minlength: 5,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});


module.exports = Task