const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const Staff = require("../database/models/staff");
const bcrypt = require("bcrypt");
const validData = require("../middleware/validData");

//ROUTES//

// routes for creating new staff
router.post("/register", validData, async (req, res, next) => {
    // destructure req.body (name, number, email, password)
    const { name, number, email, password, isManager } = req.body;

    try {
        // check if customer already exist
        const existingStaff = await Staff.findOne({ where: {staffEmail : email} });
        if (existingStaff) {
            return res.status(401).json( {message: "Staff already exits"} );
        }
        // hashes password using bcrypt and inserts a new record into the customer table
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // add new customer to database
        await Staff.create({ staffName: name, staffNumber: number, staffEmail: email, password: bcryptPassword, isManager: isManager });

        return res.status(200).json( {message: "New staff created"} );

    } catch (err) {
        next(err);
    }    
});

// routes for logging in existing customer
router.post("/login", validData, async (req, res, next) => {
    try {
        // check if staff does not exist
        const staff = await Staff.findOne({ where: {staffEmail : req.body.staffEmail} });
        if (!staff) {
            return res.status(404).json( {message: "Not a Staff Member"} );
        }
        // check if the password matches the hashed password stored in database using bcrypt
        const validPassword = await bcrypt.compare(req.body.password, staff.password);
        // if password incorrect (does not match)
        if (!validPassword) {
            return res.status(401).json( {message: "Email and Password is incorrect"} );
        }
        // if password match, generates a JWT token for the customer and sends it in JSON format
        const token = jwt.sign({id: staff.staffId, isManager:staff.isManager}, process.env.jwtSecret, {expiresIn: "2hr"});

        const { password, isManager, ...otherDetails } = staff.dataValues;
        res.cookie("token", token, {
            httpOnly: true
        })
        .status(200)
        .json({ details: { ...otherDetails }, isManager });

    } catch (err) {
        next(err);
    }
});

module.exports=router;
