import { useState, useEffect } from "react";
import axios from "axios";
import "./ICalendar.css";
import { Modal, Button } from "react-bootstrap";
import FacilityBookingDetails from "./FacilityBooking";

const ClibmingWallSchedule = (props) => {
  const [ClibmingWallSchedule, setClibmingWallSchedule] = useState([]);
  const [climbingWallActivities, setClimbingWallActivities] = useState([]);

  useEffect(() => {
    async function getClibmingWallSchedule() {
      try {
        const response = await axios.get("http://localhost:4000/api/facilities/");
        const ClibmingWall = response.data.find((facility) => facility.facilityName === "Climbing wall"); //fetches data from facilities api for ClibmingWall only
        const startTime = parseInt(ClibmingWall.startTime.slice(0, 2));
        const endTime = parseInt(ClibmingWall.endTime.slice(0, 2));
        const poolSchedule = [];
        for (let i = startTime; i < endTime; i++) {
          poolSchedule.push(`${i < 10 ? "0" + i : i}:00-${i + 1}:00`);
        }
        setClibmingWallSchedule(poolSchedule);
      } catch (error) {
        console.error(error);
      }
    }
    async function getClimbingWallActivities() {
      try {
        const response = await axios.get("http://localhost:4000/api/activities/");
        const activity = response.data.filter((a) => a.facilityName === "Climbing wall"); //fetches data from activities api for ClibmingWall only
        setClimbingWallActivities(activity);
      } catch (error) {
        console.error(error);
      }
    }

    getClibmingWallSchedule();
    getClimbingWallActivities();
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

  const renderClibmingWallSchedule = () => {
    const weekdays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

    return (
      <>
        {ClibmingWallSchedule.map((time) => {
          const nextHourTime = addOneHour(time);
          const formattedTime = time.slice(0, 5);
          return (
            <tr key={time}>
              <td>{time}</td>
              {weekdays.map((day) => {
                const activities = climbingWallActivities.filter(
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
                    {activities.map((a) => ( //displays activity name on correct day and time
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
        <h1 className="calendarTitle">Climbing Wall Timetable</h1>
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
            {ClibmingWallSchedule.length > 0 && renderClibmingWallSchedule()}
          </tbody>
        </table>
      </div>
      <Modal show={showModal}>
        <Modal.Header>
          <Modal.Title>Booking Details</Modal.Title>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Header>
        <Modal.Body>
          <FacilityBookingDetails
            selectedDay={selectedDay}
            selectedTime={selectedTime}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ClibmingWallSchedule;
