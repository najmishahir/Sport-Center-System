import React,{Fragment} from "react";
import "./facilityItem.css";

// group all facilities
const Facilities = ({ facility }) => {
  return (
    <Fragment>
    <div className="facilityItem">
      <div className="facilityName">
        <p>{facility.facilityName}</p>
      </div>
    </div>
    </Fragment>
    
  );
};
export default Facilities;
