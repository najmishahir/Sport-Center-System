require('dotenv').config();
const verifyToken = require('./verifyToken');

// verify the customer
const verifyUser = async (req, res, next) => {
    try {
        verifyToken(req, res, next, () => {
        if (req.user.id === req.params.id) {
            next();
        } else {
            return res.status(403).json( {message: "Not Authorised"} );
        }
    });
    } catch (err) {
        console.error(err.message);
        return res.status(403).json( {message: "Not Authorised"} );
    }
};

module.exports=verifyUser;