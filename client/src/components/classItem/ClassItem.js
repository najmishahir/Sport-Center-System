import React,{Fragment} from "react";
import "./classItem.css";

// group all the classes
const Classes = ({ classes }) => {
  return (
    <Fragment>
      <div className="classItem">
        <div className="className">
          <p>{classes.className}</p>
        </div>
      </div>
    </Fragment>
  );
};
export default Classes;
