require('../db/mongoose');
const User = require('../models/user');



//**********USING PROMISE CHAINNING START**********************************/
//update age by ID, and then count the number of users with update age
// User.findByIdAndUpdate('6049b383499074180c15b52c', { age: 11 })
//     .then((users) => {
//         console.log(users);
//         return User.countDocuments({ age: 11 });
//     })
//     .then((countUsersWithAge11) => {
//         console.log(countUsersWithAge11)
//     })
//     .catch((e) => {
//         console.log(e);
//     });

//**********USING PROMISE CHAINNING END**********************************/



//**********USING ASYNC AWAIT START**********************************/
const updateAgeAndThenCount = async (id, newAge) => {
    const op1 = await User.findByIdAndUpdate(id, { age: newAge });
    const op2 = await User.countDocuments({ age: newAge });
    return op2;
}


updateAgeAndThenCount('6049b383499074180c15b52c', 0).then((res) => {
    console.log(res);
}).catch((e) => {
    console.log(e);
});

//**********USING ASYNC AWAIT END**********************************/

