import { useState, useEffect } from "react";
import axios from "axios";
import "./ICalendar.css";
import { Modal, Button } from "react-bootstrap";
import BookingDetails from "./ClassBooking";
import "../ICalendar/studioCal.css";


const StudioSchedule = () => {
  const [studioSchedule, setStudioSchedule] = useState([]);
  const [studioClasses, setStudioClasses] = useState([]);
  
  useEffect(() => {

    let studio ={};

    async function getStudioSchedule() {
      try {
        const response = await axios.get("http://localhost:4000/api/facilities/");       
        studio = response.data.find((facility) => facility.facilityName === "Studio"); //fetches data from facilities api for Studio only
        const startTime = parseInt(studio.startTime.slice(0, 2));
        const endTime = parseInt(studio.endTime.slice(0, 2));
        const schedule = [];
        for (let i = startTime; i < endTime; i++) {
          schedule.push({
            time: `${i < 10 ? "0" + i : i}:00-${i + 1}:00`,
          });
        }
        setStudioSchedule(schedule);
      } catch (error) {
        console.error(error);
      }
    }

    async function getStudioClasses() {
      try {
        const response = await axios.get("http://localhost:4000/api/classes/"); //fetches data from classes api for Studio only
        const classes = response.data.filter((c) => c.facilityName === "Studio");

        setStudioClasses(classes);
      } catch (error) {
        console.error(error);
      }
    }
   
    getStudioSchedule();
    getStudioClasses();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState([]);
  const [selectedTime, setSelectedTime] = useState([]);
  const [selectedClass, setSelectedClass] = useState([]);

  const handleOpenModal = (day, time, className) => {
    setSelectedDay(day);
    setSelectedTime(time);
    setSelectedClass(className);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const renderStudioSchedule = () => {
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <>
      {studioSchedule.map((timeSlot) => (
        <tr key={timeSlot.time}>
          <td>{timeSlot.time}</td>
          {weekdays.map((day) => {
            
            return (
              <td key={day} >
                {studioClasses
                  .filter(
                    (c) =>
                      c.day === day &&
                      c.startTime.slice(0, 5) === timeSlot.time.slice(0, 5) 
                  )
                  .map((c) => {
                    return (
                      <div className="studioCalDiv" key={c.className} //displays class name in the correct time slot
                          onClick={() =>
                            handleOpenModal(day, timeSlot.time.slice(0, 5), c.className) //opens modal with booking details if clicked
                          }
                        >
                          {c.className}
                          <br />
                          <span> </span>
                      </div>
                    );
                  })}
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
};

  return (
    <div className="calContainer">
      <div className="calendar">
        <h1 className="calendarTitle">Studio Timetable</h1>
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
          <tbody>{studioSchedule.length > 0 && renderStudioSchedule()}</tbody>
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
          <BookingDetails
            selectedDay={selectedDay}
            selectedTime={selectedTime}
            selectedClass={selectedClass}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StudioSchedule;