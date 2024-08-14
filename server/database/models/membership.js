const Sequelize = require("sequelize");
const db = require("../db");
const Customer = require("./customer");
const Payment = require("./payment");

const { STRING, INTEGER, DATE } = Sequelize;

const Membership = db.define('Membership', {
    membershipType: {
        type: STRING,
        allowNull: false
    },
    price: {
        type: INTEGER,
        allowNull: false
    },
    startDate: {
        type: DATE,
        allowNull: false
    },
    endDate: {
        type: DATE,
        allowNull: false
    }
});

Membership.belongsTo(Customer, { foreignKey: 'customerId'});
Membership.belongsTo(Payment, { foreignKey: 'paymentId' });

module.exports=Membership;