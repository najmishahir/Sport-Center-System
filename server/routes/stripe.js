//Code was made with reference to Stripe Documenttaion
//https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=checkout

const express = require("express");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51MrbuEHb9PPilNEF1HgDEBmPrJYnSTEeUojKam6GR16HUsfr5G8i0gu5XO1oPJUophzGpa6JxAawBELbzelmuk7b00do44JoiY"
);
const axios = require("axios");
const Customer = require("../database/models/customer");
const Activity = require("../database/models/activity");
const Classes = require("../database/models/classes");
const Facility = require("../database/models/facility");
const Membership = require("../database/models/membership");

//Route for booking Classes/Facilities
router.post("/booking-checkout-session", async (req, res) => {
  const items = req.body.basketItems;
  console.log("received items:", items);
  const activities = await Promise.all(
    items.map((item) => Activity.findByPk(item.activityId))
  );
  const classes = await Promise.all(
    items.map((item) => Classes.findByPk(item.classId))
  );
  console.log("Activities:", activities);
  console.log("Classes:", classes);

  //Formatting the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}/${month}/${day}`;
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  const line_items = items
    .map((item, index) => {
      //If the item is an activity
      if (item.basketType === "activity") {
        const activity = activities[index];
        return {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `${item.facilityName} - ${
                activity.activityName
              } \n${formatDate(item.date)}-${formatTime(item.startTime)}`,
            },
            unit_amount: item.price * 100,
          },
          quantity: 1,
        };
        //If the item is a class
      } else if (item.basketType === "class") {
        const listedClass = classes[index];
        console.log(`Class Name: ${listedClass.className}`);
        return {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `${item.facilityName} - ${
                listedClass.className
              } \n${formatDate(item.date)}-${formatTime(item.startTime)}`,
            },
            unit_amount: item.price * 100,
          },
          quantity: 1,
        };
      } else {
        return null;
      }
    })
    .filter((item) => item !== null);

  if (line_items.length === 0) {
    return res.status(400).json("No bookings were made");
  }

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: "http://localhost:3000/booking-success", //Takes us here upon successful payment
    cancel_url: "http://localhost:3000/book-facility", //Take us back to the original page
  });
  res.send({ url: session.url });
});

//Route for purchasing a membership
router.post("/membership-checkout-session", async (req, res) => {
  //Passing stripe's price ID for each of the membership types
  const MONTHLY_PRICE = "price_1MzjbUHb9PPilNEFvKtFsuP2";
  const ANNUAL_PRICE = "price_1MzjbUHb9PPilNEFvDUoUkWa";
  const membershipType = req.body.memberType;
  //Checking the type of membership we're trying to purchase
  let membershipPrice;
  if (membershipType === "MONTHLY") {
    membershipPrice = MONTHLY_PRICE;
  } else if (membershipType === "ANNUAL") {
    membershipPrice = ANNUAL_PRICE;
  } else {
    res.status(400).json({ error: "Invalid membership type" });
    return;
  }
  //Processing the payment in stripe
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: membershipPrice,
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/membershipsuccess?membershipType=${membershipType}&success=true`, //Take us to this page when successful payment
      cancel_url: "http://localhost:3000/pricing", //Takes us back to pricing page
    });
    res.send({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message }); //Returns the error
  }
});
module.exports = router;
