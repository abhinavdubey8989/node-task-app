const express = require('express');
const userRouter = require('../src/routers/users');
const taskRouter = require('../src/routers/task');


//the below will ensure mongoose runs , and connects to DB
require('./db/mongoose');

const app = express();
const port = process.env.PORT;


//middle ware testing
// app.use((req, res, next) => {
//     console.log(' i am a middle ware !!');
//     next();
// });




//middleware to parse incoming json to object , we access this object directly
app.use(express.json());


app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log("Server up on port : " + port);
});