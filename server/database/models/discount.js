const Sequelize = require("sequelize");
const db = require("../db");

const { DECIMAL } = Sequelize;

const Discount = db.define('Discount', {
    discount: {
        type: DECIMAL(10, 2), // represents a decimal number with up to 10 digits and 2 decimal places
        allowNull: false
    }   
});

module.exports = Discount;