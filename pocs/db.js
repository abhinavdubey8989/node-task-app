//all CRUD

//mongodb npm library which allows to connect to mongodb from node.js
const mongodb = require('mongodb');


//used to initialize db connection , gives us the necessary functions to perform CRUD in db
const MongoClient = mongodb.MongoClient;
const ObjectID = require('mongodb').ObjectID;



const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';
const collectionName = 'users';//table name


//to connect to a db this method is used
MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('db connection request failed');
    }

    console.log('CONNECTED to DB !!');

    //to connect to specific DB
    const db = client.db(databaseName);


    // INSERT : this is async
    // db.collection(collectionName).insertOne({
    //     name: 'ankit',
    //     age: 24,
    //     address: 'kota'
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('error while inserting');
    //     }
    //     console.log(result.ops)
    // });


    //READ : by _id using findOne
    // db.collection(collectionName).findOne({ _id: new ObjectID("6048daeadecff34665fd84a8") }, (error, user) => {
    //     if (error) {
    //         return console.log("error while reading document");
    //     }
    //     console.log(user);
    // });


    //READ : by name feild of the document using findOne
    // db.collection(collectionName).findOne({ name: 'ankit' }, (error, user) => {
    //     if (error) {
    //         return console.log("error while reading document");
    //     }
    //     console.log(user);
    // });


    //READ : by name using find , it returns a cursor
    // db.collection(collectionName).find({ name: 'ankit' }).toArray((error, user) => {
    //     console.log(user);
    // });


    //update : using promise
    // const updatePromise = db.collection(collectionName).updateOne({ _id: new ObjectID('6048dd6213f036482a584956') }, {
    //     $set: {
    //         name: 'deepak'
    //     }
    // });
    // updatePromise.then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // });


    //DELETE : using promises here
    const deletePromise = db.collection(collectionName).deleteMany({ age: 24 });
    deletePromise.then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    });

})