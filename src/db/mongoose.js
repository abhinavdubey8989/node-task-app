
const mongoose = require('mongoose');
//mongoose is and ODM : object document mapping , jut like ORM in SQL

const baseURL = 'mongodb://127.0.0.1:27017/';
const databaseName = 'task-manager-api';
const connectionURL = baseURL + databaseName;


//connecting to DB thru mongoose
mongoose.connect(connectionURL, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
