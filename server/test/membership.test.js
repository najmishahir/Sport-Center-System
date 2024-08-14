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

// test for Customer buy membership
describe("Customer buy membership", () => {
    describe("POST /api/membership/buy", () => {
        // test for successful purchase
        test("Should respond with a 200 status code", async () => {
            const result = await pool.query('SELECT "customerId" FROM "Customers" LIMIT 1');
            const customerId = result.rows[0].customerId;
            const res = await request(app).post("/api/membership/buy/" + customerId).send({
                membershipType: "MONTHLY"
            });
            expect(res.statusCode).toBe(200);
            expect(res.body.details).toBe(res.body.details);
        });
        
        // test for unseccessul purchase
        test("Should respond with a 400 status code and an error message if customer already have membership", async () => {
            const result = await pool.query('SELECT "customerId" FROM "Customers" LIMIT 1');
            const customerId = result.rows[0].customerId;
            const res = await request(app).post("/api/membership/buy/" + customerId).send({
                membershipType: "MONTHLY"
            });
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("Customer already has a membership");
        });
    });
});

// test for Customer cancel membership
describe("Customer cancel membership", () => {
    describe("POST /api/membership/cancel", () => {
        // test for successful cancel
        test("Should respond with a 200 status code", async () => {
            const result = await pool.query('SELECT "customerId" FROM "Customers" LIMIT 1');
            const customerId = result.rows[0].customerId;
            const res = await request(app).post("/api/membership/cancel/" + customerId).send({});
            expect(res.statusCode).toBe(200);
            expect(res.body.details).toBe(res.body.details);
        });
        
        // test for unseccessul cancel
        test("Should respond with a 400 status code and an error message if customer is not member", async () => {
            const result = await pool.query('SELECT "customerId" FROM "Customers" LIMIT 1');
            const customerId = result.rows[0].customerId;
            const res = await request(app).post("/api/membership/cancel/" + customerId).send({});
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("Customer does not have a membership");
        });
    });
});