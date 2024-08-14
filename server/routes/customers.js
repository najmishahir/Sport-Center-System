const express = require("express");
const router = express.Router();
const Customer  = require("../database/models/customer");
const Membership = require("../database/models/membership");
const bcrypt = require("bcrypt");

// 1. Update customer info
router.put("/:id", async (req, res, next) => {
    try {
        const updateUser = await Customer.findByPk(req.params.id);
        const { customerName, customerNumber, customerEmail, ...rest } = req.body;
        // check if number is 11 digits
        if (customerNumber && customerNumber.length !== 11) {
            return res.status(401).json( {message: "Invalid Phone Number"} );
        }
        // check if email is valid
        if (!/^[^\s@]+@(gmail\.com|yahoo\.com|hotmail\.com)$/.test(customerEmail)) {
            return res.status(401).json( {message: "Invalid Email"} );
        }
        const updatedCustomer = await updateUser.update({
            customerName: customerName.toUpperCase(),
            customerEmail,
            customerNumber,
            ...rest
        });
        res.status(200).json(updatedCustomer);
    } catch (err) {
        next(err);
    }
});

// 2. To find a single customer
router.get("/find/:id", async (req, res, next) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        res.json(customer);
    } catch (err) {
        next(err);
    }
});

// 3. To get all customers
router.get("/", async (req, res, next) => {
    try {
        const customers = await Customer.findAll();
        res.json(customers);
    } catch (err) {
        next(err);
    }
});

// 4. Change password
router.put("/change-password/:id", async (req, res, next) => {
        try {
        const { password } = req.body;
        let bcyrptPassword;
        if (password) {
            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);
            bcyrptPassword = await bcrypt.hash(password, salt);
        }
        const updateUser = await Customer.findByPk(req.params.id);
        const updatedPassword = await updateUser.update({ ...req.body, password: bcyrptPassword });
        res.status(200).json(updatedPassword);
    } catch (err) {
        next(err);
    }
});

// 5. For customer to delete account
router.delete("/:id", async (req, res, next) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if(!customer) return res.status(404).json({ message: "Customer not found" });
        else {
            const membership = await Membership.findOne({
                where: {customerId: req.params.id},
            });
            if (membership) {
                await membership.destroy();
            }
            await customer.destroy(req.body);
            res.status(200).json({ message: "Account deleted" });
        }
    } catch (err) {
        next(err);
    }
});

module.exports=router;
