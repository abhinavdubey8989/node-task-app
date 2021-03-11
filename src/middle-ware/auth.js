

const jwt = require('jsonwebtoken');
const { User, SIGN_KEY } = require('../models/user');



const auth = async (req, res, next) => {

    try {

        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, SIGN_KEY);

        //used findOne and not findById
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user) {
            throw new Error();
        }

        req.token = token;//used in logout , to delete this token from DB
        req.user = user; //so that a 2nd DB request is not made 
        next();
    } catch (e) {
        res.status(401).send({ error: 'Not Authenticated' });
    }
}


module.exports = auth