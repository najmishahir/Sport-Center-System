require('dotenv').config();
const jwt = require('jsonwebtoken');

const SECRET = process.env.jwtSecret;

const verifyToken = async (req, res, next) => {
    try {       
        // destructure the token from fetch request
        const token = req.cookies.token;
        // if not authorize to enter
        if (!token) {
            return res.status(403).json( {message: "Not Authenticated"} );
        }
        // check validity of token
        // if the token is valid, the payload data is extracted and set to req.user
        jwt.verify(token, SECRET, (err, user) => {
            if (err) return res.status(403).json( {message: "Token not valid"} );
            req.user = user;
            next();
        });      
    } catch (err) {
        console.error(err.message);
        return res.status(403).json( {message: "Not Authenticated"} );
    }
};

module.exports = verifyToken;