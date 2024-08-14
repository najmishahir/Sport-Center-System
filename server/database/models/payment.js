const Sequelize = require("sequelize");
const db = require("../db");
const Customer = require("./customer");

const { INTEGER, DATE, TIME, FLOAT } = Sequelize;

const Payment = db.define('Payment', {
    paymentId: {
        type: INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    amount: {
        type: FLOAT,
        allowNull: false
    },
    date: {
        type: DATE,
        allowNull: false
    },
    time: {
        type: TIME,
        allowNull: false
    }
});

// add foreign key constraint to customerId column
// Payment.belongsTo(Customer, { foreignKey: 'customerId' });

module.exports=Payment;