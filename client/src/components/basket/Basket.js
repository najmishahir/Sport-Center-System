import React, { useState, useContext, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import "./basket.css";
import { Link } from "react-router-dom";
import { Auth } from "../../context/Auth";
import axios from "axios";
import PayButton from "../paybutton/PayButton";

export default function Basket() {
  const { user } = useContext(Auth);
  const [items, setItems] = useState([]);
  //useEffect is used to automatically get the basket items from the database
  useEffect(() => {
    if (user && user.details) {
      const fetchBasketItems = async () => {
        try {
          const response = await axios.get(
            "http://localhost:4000/api/basket/basket/" + user.details.customerId
          );
          const itemsWithNames = await Promise.all(
            response.data.map(async (item) => {
              if (item.basketType === "class") {
                const classResponse = await axios.get(
                  "http://localhost:4000/api/classes/find/" + item.classId
                );
                return {
                  ...item,
                  className: classResponse.data.className,
                };
              } else {
                const activityResponse = await axios.get(
                  "http://localhost:4000/api/activities/find/" + item.activityId
                );
                return {
                  ...item,
                  activityName: activityResponse.data.activityName,
                };
              }
            })
          );
          setItems(itemsWithNames);
        } catch (error) {
          console.error(error);
        }
      };

      fetchBasketItems();
    }
  }, [user, user?.details]);

  // function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}/${month}/${day}`;
  };
  // function to format the time
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  // function to calculate total cost in basket
  const calculateTotalCost = () => {
    const total = items.reduce((total, item) => total + item.price, 0);
    return total.toFixed(2);
  };

  // remove button
  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/basket/${user.details.customerId}/${itemId}`
      );
      const response = await axios.get(
        `http://localhost:4000/api/basket/basket/${user.details.customerId}`
      );
      setItems(response.data);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="basket">
      <span className="basketTitle">Basket</span>
      <div className="userBasket">
        {user ? (
          items.map((item) => (
            <div className="itemInBasket" key={item.basketId}>
              <div className="itemDescription">
                <p>{`${item.facilityName} - ${
                  item.basketType === "class"
                    ? item.className
                    : item.activityName
                }`}</p>
                <p>{`${formatDate(item.date)} - ${formatTime(
                  item.startTime
                )}`}</p>
              </div>
              <div className="belowDescription">
                <div className="itemCost">
                  <p>£{item.price}</p>
                </div>
                <button
                  className="removeBookingButton"
                  onClick={() => handleRemoveItem(item.basketId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="basketLoginPrompt">
            <div className="basketLoginPromptDescription">
              Login to add new bookings!
            </div>
            <Link to="../login">
              <button className="basketLoginButton">Login</button>
            </Link>
          </div>
        )}
      </div>
      <div className="basketBottom">
        <div className="basketTotalCost">
          {user ? <p>Total: £{calculateTotalCost()}</p> : <p></p>}
        </div>
        {user ? <PayButton items={items} /> : ""}
      </div>
    </div>
  );
}
