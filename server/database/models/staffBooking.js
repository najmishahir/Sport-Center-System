const Sequelize = require("sequelize");
const db = require("../db");
const Staff = require("./staff");
const Booking = require("./booking");

const { INTEGER } = Sequelize;

const StaffBooking = db.define('StaffBooking', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  }
});

StaffBooking.belongsTo(Staff, { foreignKey: 'staffId' });
StaffBooking.belongsTo(Booking, { foreignKey: 'bookingId' });

module.exports=StaffBooking;