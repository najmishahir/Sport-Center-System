const request = require("supertest");
const app = require("../index");
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'gymCorp',
    password: 'hogwarts6393',
    port: 5432,
});

describe("Customer add item to basket AND make a booking", () => {
    describe("POST /api/basket/basketid", () => {
        // test for successful add item to basket
        test("Should respond with a 200 status code and a success message", async () => {
            const result = await pool.query('SELECT "customerId" FROM "Customers" LIMIT 1');
            const customerId = result.rows[0].customerId;
            const res = await request(app).post("/api/basket/basketid").send({
                customerId: customerId,
                date: "2023-10-5",
                start: "17:00",
                activityId: "1",
                facilityName: "Swimming pool"
            });
            expect(res.statusCode).toBe(200);
            expect(res.body.details).toBe(res.body.details);
        });
        
        // test for unsuccessful adding item to basket (same item)
        test("Should respond with a 401 status code and error message if same item is added to basket", async () => {
            const result = await pool.query('SELECT "customerId" FROM "Customers" LIMIT 1');
            const customerId = result.rows[0].customerId;
            const res = await request(app).post("/api/basket/basketid").send({
                customerId: customerId,
                date: "2023-10-5",
                start: "17:00",
                activityId: "1",
                facilityName: "Swimming pool"
            });
            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe("Item has already added to basket");
        });
        
        // test for unsuccessful adding item to basket (no activity at the facility)
        test("Should respond with a 401 status code and error message if wrong activity/facility", async () => {
            const result = await pool.query('SELECT "customerId" FROM "Customers" LIMIT 1');
            const customerId = result.rows[0].customerId;
            const res = await request(app).post("/api/basket/basketId").send({
                customerId: customerId,
                date: "2023-10-6",
                start: "17:00",
                activityId: "7",
                facilityName: "Swimming pool"
            });
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("This activity is not available at this facility");
        });
        
    });
    describe("POST /api/bookings/bookingid", () => {
        // successful booking
        test("Should respond with a 200 status code and a success message", async () => {
            const result = await pool.query('SELECT "customerId" FROM "Customers" LIMIT 1');
            const customerId = result.rows[0].customerId;
            const res = await request(app).post("/api/bookings/bookingid").send({
                customerId: customerId,
            });
            expect(res.statusCode).toBe(200);
            expect(res.body.details).toBe(res.body.details);
        });
        // test for unsuccessful adding item to basket (add same item to existing bookings)
        test("Should respond with a 401 status code and error message if adding item to an existing bookings", async () => {
            const result = await pool.query('SELECT "customerId" FROM "Customers" LIMIT 1');
            const customerId = result.rows[0].customerId;
            const res = await request(app).post("/api/basket/basketid").send({
                customerId: customerId,
                date: "2023-10-5",
                start: "17:00",
                activityId: "1",
                facilityName: "Swimming pool"
            });
            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe("You already have a booking for this session");
        });
    });

});

describe("Staff Make a Booking", () => {
    describe("POST api/bookings/staff-booking", () => {
        // test for successful bookings by a staff
        test("Should respond with a 200 status code and a success message", async () => {
            const result = await pool.query('SELECT "customerId" FROM "Customers" LIMIT 1');
            const customerId = result.rows[0].customerId;
            const result2 = await pool.query('SELECT "staffId" FROM "Staffs" LIMIT 1');
            const staffId = result2.rows[0].staffId;
            const res = await request(app).post("/api/bookings/staff-booking").send({
                customerId: customerId,
                staffId: staffId,
                date: "2023-10-5",
                start: "17:00",
                activityId: "7",
                facilityName: "Squash court A"
            });
            expect(res.statusCode).toBe(200);
            expect(res.body.details).toBe(res.body.details);
        });
        // test for unsuccesful bookings by staff, customer has already make booking
        test("Should respond with a 401 status code and error message if customer has already make a booking", async () => {
            const result = await pool.query('SELECT "customerId" FROM "Customers" LIMIT 1');
            const customerId = result.rows[0].customerId;
            const result2 = await pool.query('SELECT "staffId" FROM "Staffs" LIMIT 1');
            const staffId = result2.rows[0].staffId;
            const res = await request(app).post("/api/bookings/staff-booking").send({
                customerId: customerId,
                staffId: staffId,
                date: "2023-10-5",
                start: "17:00",
                activityId: "7",
                facilityName: "Squash court A"
            });
            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe("Customer has already booked this session");
        });
        // test for unsuccesful bookings by staff, customer has already make booking
        test("Should respond with a 401 status code and error message if capacity has reached", async () => {
            await pool.query('UPDATE "Facilities" SET "capacity" = 1 WHERE "facilityName" = \'Squash court A\'');
            const result = await pool.query('SELECT "customerId" FROM "Customers" LIMIT 2');
            const customerId = result.rows[1].customerId;
            const result2 = await pool.query('SELECT "staffId" FROM "Staffs" LIMIT 1');
            const staffId = result2.rows[0].staffId;
            const res = await request(app).post("/api/bookings/staff-booking").send({
                customerId: customerId,
                staffId: staffId,
                date: "2023-10-5",
                start: "17:00",
                activityId: "7",
                facilityName: "Squash court A"
            });
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("Capacity has been reached");
            await pool.query('UPDATE "Facilities" SET "capacity" = 4 WHERE "facilityName" = \'Squash court A\'');
            await pool.query('DELETE from "Customers" where "customerName"= \'EDMUND\'');
        });
    });
})