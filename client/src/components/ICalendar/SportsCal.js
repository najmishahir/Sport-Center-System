import { useState, useEffect } from "react";
import axios from "axios";
import "./ICalendar.css";
import { Modal, Button } from "react-bootstrap";
import BookingDetails from "./FacilityBooking";

const SportsHallSchedule = () => {
  const [SportsHallSchedule, setSportsHallSchedule] = useState([]);
  const [SportsHallActivities, setSportsHallActivities] = useState([]);

  useEffect(() => {
    async function getSportsHallSchedule() {
      try {
        const response = await axios.get("http://localhost:4000/api/facilities/");
        const SportsHall = response.data.find((facility) => facility.facilityName === "Sports hall"); //fetches data from facilities api for Sports Hall only
        const startTime = parseInt(SportsHall.startTime.slice(0, 2));
        const endTime = parseInt(SportsHall.endTime.slice(0, 2));
        const poolSchedule = [];
        for (let i = startTime; i < endTime; i++) {
          poolSchedule.push(`${i < 10 ? "0" + i : i}:00-${i + 1}:00`);
        }
        setSportsHallSchedule(poolSchedule);
      } catch (error) {
        console.error(error);
      }
    }
    async function getSportsHallActivities() {
      try {
        const response = await axios.get("http://localhost:4000/api/activities/");
        const activity = response.data.filter((a) => a.facilityName === "Sports hall"); //fetches data from activities api for Sports Hall only
        setSportsHallActivities(activity);
      } catch (error) {
        console.error(error);
      }
    }

    getSportsHallSchedule();
    getSportsHallActivities();
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

  const renderSportsHallSchedule = () => {
    const weekdays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

    return (
      <>
        {SportsHallSchedule.map((time) => {
          const nextHourTime = addOneHour(time);
          const formattedTime = time.slice(0, 5);
          return (
            <tr key={time}>
              <td>{time}</td>
              {weekdays.map((day) => {
                const activities = SportsHallActivities.filter(
                  (a) =>
                    (a.day === day &&
                      a.startTime.slice(0, 5) === formattedTime) ||
                    (a.day === day &&
                      a.startTime.slice(0, 5) === nextHourTime.slice(0, 5))
                );
                return (
                  <td
                    key={day}
                    onClick={() => handleOpenModal(day, formattedTime)}
                  >
                    {activities.map((a) => (
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
        <h1 className="calendarTitle">Sports Hall Timetable</h1>
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
            {SportsHallSchedule.length > 0 && renderSportsHallSchedule()}
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
    <BookingDetails selectedDay={selectedDay} selectedTime={selectedTime} />
  </Modal.Body>
</Modal>
    </div>
  );
};

export default SportsHallSchedule;
