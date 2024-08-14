const express = require('express');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const db = require("./database/db")

const app = express();
dotenv.config();

// middleware
app.use(cors());
app.use(express.json({
  verify: function(req, res, buf) {
    var url = req.originalUrl;
    if(url.endsWith('/hooks')){
    req.rawBody = buf.toString();
    }
  }
}));
app.use(cookieParser())
//added the verify section for the use of stripe hooks.

// routes
app.use("/api/auth", require("./routes/customerRoutes"));
app.use("/api/customer", require("./routes/customers"));
app.use("/auth/staff", require("./routes/staffRoutes"));
app.use("/api/employee", require("./routes/employee"));
app.use("/api/activities", require("./routes/activity"));
app.use("/api/classes", require("./routes/classes"));
app.use("/api/facilities", require("./routes/facility"));
app.use("/api/bookings", require("./routes/booking"));
app.use("/api/membership", require("./routes/membership"));
app.use("/api/basket", require("./routes/basket"));
app.use("/api/stripe", require("./routes/stripe"));
app.use("/api/discount", require("./routes/discount"));


app.use((err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMessage = err.message || "Something went wrong.";
  return res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMessage,
    stack: err.stack,
  });
});

db.authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Error: " + err));

module.exports = app;