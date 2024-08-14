import { useState, useEffect } from "react";
import axios from "axios";
import "./ICalendar.css";
import { Modal, Button } from "react-bootstrap";
import BookingDetails from "./FacilityBooking";

const SquashCourtBSchedule = () => {
  const [SquashCourtSchedule, setSquashCourtSchedule] = useState([]);
  const [SquashCourtActivities, setSquashCourtActivities] = useState([]);

  useEffect(() => {
    async function getSquashCourtSchedule() {
      try {
        const response = await axios.get("http://localhost:4000/api/facilities/");
        const SquashCourt = response.data.find((facility) => facility.facilityName === "Squash court B"); //fetches data from facilities api for Squash Court B only
        const startTime = parseInt(SquashCourt.startTime.slice(0, 2));
        const endTime = parseInt(SquashCourt.endTime.slice(0, 2));
        const poolSchedule = [];
        for (let i = startTime; i < endTime; i++) {
          poolSchedule.push(`${i < 10 ? "0" + i : i}:00-${i + 1}:00`);
        }
        setSquashCourtSchedule(poolSchedule);
      } catch (error) {
        console.error(error);
      }
    }
    async function getSquashCourtActivities() {
      try {
        const response = await axios.get("http://localhost:4000/api/activities/");
        const activity = response.data.filter((a) => a.facilityName === "Squash court B"); //fetches data from activities api for Squash Court B only
        setSquashCourtActivities(activity);
      } catch (error) {
        console.error(error);
      }
    }

    getSquashCourtSchedule();
    getSquashCourtActivities();
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

  const renderSquashCourtSchedule = () => {
    const weekdays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

    return (
      <>
        {SquashCourtSchedule.map((time) => {
          const nextHourTime = addOneHour(time);
          const formattedTime = time.slice(0, 5);
          return (
            <tr key={time}>
              <td>{time}</td>
              {weekdays.map((day) => {
                const activities = SquashCourtActivities.filter(
                  (a) =>
                    (a.day === day &&
                      a.startTime.slice(0, 5) === time.slice(0, 5)) ||
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
        <h1 className="calendarTitle">Squash Court B Timetable</h1>
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
            {SquashCourtSchedule.length > 0 && renderSquashCourtSchedule()}
          </tbody>
        </table>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BookingDetails
            selectedDay={selectedDay}
            selectedTime={selectedTime}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SquashCourtBSchedule;
