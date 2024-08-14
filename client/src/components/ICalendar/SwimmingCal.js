import { useState, useEffect } from "react";
import axios from "axios";
import "./ICalendar.css";
import { Modal, Button } from "react-bootstrap";

import FacilityBookingDetails from "./FacilityBooking";

const SwimmingPoolSchedule = (props) => {
  const [swimmingPoolSchedule, setSwimmingPoolSchedule] = useState([]);
  const [swimmingPoolActivities, setSwimmingPoolActivities] = useState([]);

  useEffect(() => {
    async function getSwimmingPoolSchedule() {
      try {
        const response = await axios.get("http://localhost:4000/api/facilities/");
        const swimmingPool = response.data.find((facility) => facility.facilityName === "Swimming pool"); //fetches data from facilities api for swimming pool only
        const startTime = parseInt(swimmingPool.startTime.slice(0, 2));
        const endTime = parseInt(swimmingPool.endTime.slice(0, 2));
        const poolSchedule = [];
        for (let i = startTime; i < endTime; i++) {
          poolSchedule.push(`${i < 10 ? "0" + i : i}:00-${i + 1}:00`);
        }
        setSwimmingPoolSchedule(poolSchedule);
      } catch (error) {
        console.error(error);
      }
    }
    async function getSwimmingPoolActivities() {
      try {
        const response = await axios.get("http://localhost:4000/api/activities/");
        const activity = response.data.filter((a) => a.facilityName === "Swimming pool"); //fetches data from activities api for swimming pool only

        setSwimmingPoolActivities(activity);
      } catch (error) {
        console.error(error);
      }
    }

    getSwimmingPoolSchedule();
    getSwimmingPoolActivities();
  }, []);

  const addOneHour = (timeString) => {
    const hour = parseInt(timeString.slice(0, 2));
    const nextHour = hour - 1;
    const formattedNextHour = nextHour < 10 ? "0" + nextHour : nextHour;
    return `${formattedNextHour}${timeString.slice(2)}`;
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState([]);
  const [selectedTime, setSelectedTime] = useState([]);

  const handleOpenModal = (day, time) => {
    setSelectedDay(day);
    setSelectedTime(time);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const renderSwimmingPoolSchedule = () => {
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return (
      <>
        {swimmingPoolSchedule.map((time) => {
          const nextHourTime = addOneHour(time);
          const formattedTime = time.slice(0, 5);
          return (
            <tr key={time}>
              <td>{time}</td>
              {weekdays.map((day) => {
                const activities = swimmingPoolActivities.filter(
                  (a) =>
                    (a.day === day &&
                      a.startTime.slice(0, 5) === formattedTime) ||
                    (a.day === day &&
                      a.startTime.slice(0, 5) === nextHourTime.slice(0, 5))
                );
                return (
                  <td
                    key={day}
                    onClick={() => handleOpenModal(day, formattedTime)} //opens modal with booking details if clicked
                  >
                    {activities.map((a) => ( //displays class name in the correct time slot
                      <div key={a.activityName}>
                        <div>{a.activityName}</div>
                      </div>
                    ))}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </>
    );
  };

  return (
    <div className="calContainer">
      <div className="calendar">
        <h1 className="calendarTitle">Swimming Pool Timetable</h1>
        <table className="timetable">
          <thead>
            <tr>
              <th>Time</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
              <th>Saturday</th>
              <th>Sunday</th>
            </tr>
          </thead>
          <tbody>
            {swimmingPoolSchedule.length > 0 && renderSwimmingPoolSchedule()}
          </tbody>
        </table>
      </div>
      <Modal show={showModal} >
  <Modal.Header>
    <Modal.Title>Booking Details</Modal.Title>
    <Button variant="secondary" onClick={handleCloseModal}>
      Close
    </Button>
  </Modal.Header>
  <Modal.Body>
    <FacilityBookingDetails selectedDay={selectedDay} selectedTime={selectedTime} />
  </Modal.Body>

</Modal>

    </div>
  );
};

export default SwimmingPoolSchedule;
