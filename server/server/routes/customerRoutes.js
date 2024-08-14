const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const Customer  = require("../database/models/customer");
const bcrypt = require("bcrypt");
const validData = require("../middleware/validData");

// routes for registering new customer
router.post("/register", validData, async (req, res, next) => {
    // destructure req.body (name, number, email, password)
    const { name, number, email, password } = req.body;

    try {
        // check if customer already exist
        const existingCustomer = await Customer.findOne({ where: {customerEmail : email} });
        if (existingCustomer) {
            return res.status(401).json({ message: "User already exists" });
        }
        // hashes password using bcrypt and inserts a new record into the customer table
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // capitalize the first letter of each word in the name
        let capitalName = name.toUpperCase();

        // add new customer to database
        const newCustomer = await Customer.create({ customerName: capitalName, customerNumber: number, customerEmail: email, password: bcryptPassword });
        await newCustomer.save();
        return res.status(200).json({ message: "New customer created" });
    } catch (err) {
        next(err);
    }    
});

// routes for logging in existing customer
router.post("/login", async (req, res, next) => {
    try {
        // check if customer does not exist
        const customer = await Customer.findOne({ where: {customerEmail : req.body.customerEmail} });
        if (!customer) {
            return res.status(404).json({ message: "User not found" });
        }
        // check if the password matches the hashed password stored in database using bcrypt
        const validPassword = await bcrypt.compare(req.body.password, customer.password);
        // if password incorrect (does not match)
        if (!validPassword) {
            return res.status(401).json({ message: "Email and Password is incorrect" });
        }
        // if password match, generates a JWT token for the customer and sends it in JSON format
        const token = jwt.sign({id: customer.customerId}, process.env.jwtSecret, {expiresIn: "2hr"});

        const { password, ...otherDetails } = customer.dataValues;
        res.cookie("token", token, {
            httpOnly: true,
        })
        .json({details: {...otherDetails}});
    } catch (err) {
        next(err);
    }
});

module.exports = router;
