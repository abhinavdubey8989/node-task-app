
const mongoose = require('mongoose');
//mongoose is and ODM : object document mapping , jut like ORM in SQL


const connectionURL = process.env.DB_CONNECTION_STRING;


//connecting to DB thru mongoose
mongoose.connect(connectionURL, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
