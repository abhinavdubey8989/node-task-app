


const validator = require('validator');
const mongoose = require('mongoose');





const taskSchema = new mongoose.Schema(

    {
        description: {
            type: String,
            minlength: 5,
            required: true,
            trim: true
        },
        completed: {
            type: Boolean,
            default: false
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId, //owner needs to be objectId from user's table
            required: true,
            ref: 'User', //model name of the table which it refers
        },

    },

    {
        timestamps: true
    }


);


const Task = mongoose.model('Task', taskSchema);


module.exports = Task