const Sequelize = require("sequelize");
const db = require("../db");
const Facility = require("./facility")

const { INTEGER, STRING, FLOAT, TIME } = Sequelize;

const Activity = db.define('Activity', {
    activityId: {
        type: INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    activityName: {
        type: STRING,
        primaryKey: true,
        allowNull: false
    },
    day: {
        type: STRING,
        allowNull: true,
    },
    startTime: {
        type: TIME,
        allowNull: true,
    },
    endTime: {
        type: TIME,
        allowNull: true,
    },
    price: {
        type: FLOAT,
        allowNull: false
    }
});

// add foreign key constraint to facilityId column
Activity.belongsTo(Facility, { foreignKey: 'facilityName' });

module.exports = Activity;