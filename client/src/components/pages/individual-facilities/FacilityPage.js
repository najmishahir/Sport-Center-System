import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../navbar/Navbar";
import Basket from "../../basket/Basket";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import SwimmingPoolSchedule from "../../ICalendar/SwimmingCal";
import SportsHallSchedule from "../../ICalendar/SportsCal";
import SquashCourtSchedule from "../../ICalendar/SquashCal";
import SquashCourtBSchedule from "../../ICalendar/SquashCalB";
import ClimbingWallSchedule from "../../ICalendar/ClimbCal";
import FitnessRoomSchedule from "../../ICalendar/FitnessCal";
import StudioSchedule from "../../ICalendar/StudioCal";
import "./facilityPage.css";

function FacilityPage() {
  const location = useLocation();
  const facility = location.state ? location.state.facility : null;

  //Make switch cases to render timetable based on the current facility we're accessing
  let Timetable;
  switch (facility.facilityName) {
    case "Swimming pool":
      Timetable = <SwimmingPoolSchedule />;
      break;
    case "Sports hall":
      Timetable = <SportsHallSchedule />;
      break;
    case "Squash court A":
      Timetable = <SquashCourtSchedule />;
      break;
    case "Squash court B":
      Timetable = <SquashCourtBSchedule />;
      break;
    case "Climbing wall":
      Timetable = <ClimbingWallSchedule />;
      break;
    case "Fitness room":
      Timetable = <FitnessRoomSchedule />;
      break;
    case "Studio":
      Timetable = <StudioSchedule />;
      break;
    default:
      Timetable = <div>No schedule available for this facility</div>;
  }

  return (
    <div className="bookingFacilityPage">
      <Navbar />
      <div className="facilityPageContainer">
        <div className="facilityPageWrapper">{Timetable}</div>
        <div className="calenderBasket">
          <Basket />
        </div>
      </div>
    </div>
  );
}

export default FacilityPage;
