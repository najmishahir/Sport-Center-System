const express = require("express");
const router = express.Router();
const Discount  = require("../database/models/discount");

// 1. new discount
router.post('/', async (req, res, next) => {
    try {
        const { discount } = req.body;

        // Create a new Discount record for the customer
        const newDiscount = await Discount.create({discount});
        
        return res.status(201).json(newDiscount);

    } catch (err) {
        next(err);
    }
});

// 2. update discount
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { discount } = req.body;

        // find the Discount record to update
        const discountToUpdate = await Discount.findByPk(id);
        if (!discountToUpdate) {
            return res.status(404).json({ message: "Discount not found" });
        }

        // update the discount value
        discountToUpdate.discount = discount;
        await discountToUpdate.save();

        return res.status(200).json(discountToUpdate);

    } catch (err) {
        next(err);
    }
});

// 3. Get discount
router.get('/', async (req, res) => {
    try {
        const discount = await Discount.findOne();
        res.json(discount);
    } catch (err) {
        next(err)
    }
});

module.exports = router;