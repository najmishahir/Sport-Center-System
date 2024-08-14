const express = require("express");
const router = express.Router();
const Activity  = require("../database/models/activity");
const Facility  = require("../database/models/facility");

// 1. Add new activities (only for manager)
router.post("/activityid", async (req, res, next) => {
    const { name, price, facilityName, day, start, end } = req.body;
    try {
        const facility = await Facility.findByPk(facilityName);
        if (!facility) 
            return res.status(404).send({ message: "Facility not found" });

        // check if activity already exist
        const existingActivity = await Activity.findOne({ where: {activityName: name, facilityName:facilityName}});
        if (existingActivity) 
            return res.status(401).send({ message: "Activity already exists" });

        const newActivity = await Activity.create({ 
            activityName: name, 
            price: price, 
            facilityName: facilityName, 
            day: day, 
            startTime: start,
            endTime: end
         });
        return res.status(200).json(newActivity);
    } catch (err) {
        next(err);
    }
});

// 2. Update an existing activity (only for manager)
router.put("/:id", async (req, res, next) => {
    try {
        const updateActivity = await Activity.findByPk(req.params.id);
        const updatedActivity = await updateActivity.update(req.body);
        return res.status(200).json(updatedActivity);
    } catch (err) {
        next(err);
    }
});

// 3. Delete activity (only for manager)
router.delete("/:id", async (req, res, next) => {
    try {
        const activity = await Activity.findByPk(req.params.id);
        if(!activity) return res.status(404).send({ message: "Activity not found" });
        else { 
            await activity.destroy();
            res.status(200).json({ message: "Activity deleted" });
        }
    } catch (err) {
        next(err);
    }
});

// 4. Get an activity
router.get("/find/:id", async (req, res, next) => {
    try {
        const activity = await Activity.findByPk(req.params.id);
        res.status(200).json(activity);
    } catch (err) {
        next(err);
    }
});

// 5. Get all activities
router.get("/", async (req, res, next) => {
    try {
        const activities = await Activity.findAll();
        res.json(activities);
    } catch (err) {
        next(err);
    }
});

// 6. Get all activities and their corresponding facilities
router.get('/facilities', async (req, res) => {
  try {
    const availableActivities = await Activity.findAll({
      attributes: ['activityName'],
      include: [{
        model: Facility,
        attributes: ['facilityName']
      }],
      group: ['activityName', 'Facility.facilityName']
    });
    res.json(availableActivities);
  } catch (err) {
    next(err);
  }
});

module.exports=router;