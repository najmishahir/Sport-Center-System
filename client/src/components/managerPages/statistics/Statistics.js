import React, { Fragment, useState, useEffect } from "react";
import "./statistics.css";
import Navbar from "../managerNavbar/ManagerNavbar";
import useFetch from "../hooks/useFetch"
import moment from 'moment';
import 'moment/locale/en-gb';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar ,PieChart, Pie} from 'recharts';


  
const Statistics = () => {

    //Get booking data
    const {data:bookingData} = useFetch ("http://localhost:4000/api/bookings/");
    const [bookingDetails, setBookingDetails] = useState([]);
    useEffect(() => {
        setBookingDetails(bookingData.map(({noOfPeople, date, startTime, endTime, bookingType, activityId, classId,facilityName,price}) => {
        return {
            noOfPeople,
            date,
            startTime, 
            endTime, 
            bookingType, 
            activityId, 
            classId,
            facilityName,
            price,
        };
      }));
    }, [bookingData]);


    //Get activity data
    const {data:activityData} = useFetch ("http://localhost:4000/api/activities/");
    const [activityDetails, setActivityDetails] = useState([])
    useEffect(() => {
        setActivityDetails(activityData.map(({ activityId, activityName, facilityName }) => {
          return {
            activityId,
            activityName,
            facilityName
          };
        }));      
      }, [activityData]);



    //Get facility data
    const {data:facilityData} = useFetch ("http://localhost:4000/api/facilities/");
    const [facilityDetails, setFacilityDetails] = useState([]);
    useEffect(()=>{
        setFacilityDetails(facilityData.map(({facilityName})=>{
            return{
                facilityName,
              };
        }));
    },[facilityData]);

    //Get class data
    const {data:classData} = useFetch ("http://localhost:4000/api/classes/");
    const [classNames, setClassNames] = useState([]);
    const [classDetails, setClassDetails] = useState([]);

    useEffect(()=>{

        setClassDetails(classData.map((className, index) => ({ 
            className: className.className,
            classId: className.classId,

            

        })));

        const uniqueClassNames = classData.reduce((uniqueClasses, currentClass) => {
          if (!uniqueClasses.includes(currentClass.className)) {
            uniqueClasses.push(currentClass.className);
          }
          return uniqueClasses;
        }, []);
        
        setClassNames(uniqueClassNames.map(className => ({ 
            className 
        })));
      }, [classData]);
      


    //handle sidebar clicking
    const [selectedFacility, setSelectedFacility] = useState("Summary");
    const handleFacilityClick = (facility) => {
        setSelectedFacility(facility);
    }; 

    //for groupedActivities
    const [activityGroup, setActivityGroup] = useState(activityDetails);
    
    //Bar chart data
    const [barChartData, setBarChartData] = useState();
    //Pie chart data
    const [pieChartData, setPieChartData] = useState();

    //Calculate total revenue
    const [revenueData, setRevenueData] = useState();

    const [classRevenueData, setClassRevenueData] = useState();

    // Set Monday as the start of the week
    moment.locale('en-gb', {
        week: {
        dow: 1, // Monday is the first day of the week
        },
    });

    //For choosing week 
    const [dateRange, setDateRange] = useState({
        start: moment().startOf('week'),
        end: moment().endOf('week')
    });

    const handleBackWeek = () => {
        setDateRange({
            start: moment(dateRange.start).subtract(1, 'week').startOf('week'),
            end: moment(dateRange.end).subtract(1, 'week').endOf('week')
        });
    };

    const handleForwardWeek = () => {
        setDateRange({
            start: moment(dateRange.start).add(1, 'week').startOf('week'),
            end: moment(dateRange.end).add(1, 'week').endOf('week')
        });
    };

    useEffect(() => {
        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"];
        const facilities = ["Studio","Swimming pool", "Fitness room","Sports hall","Squash court A", "Squash court B", "Climbing wall"];


        
        // create an initial array with every combination of day and facility set to 0
        const initFacDay = daysOfWeek.map(day => {
            const facToDay = { day };
            facilities.forEach(facility => facToDay[facility] = 0);
            return facToDay;
        });

        const initFacPrice = facilities.map(facility => ({
            facilityName: facility,
            revenue : 0
        }));

         //Makes array of form {facilityName:Swimming pool, activityNames:["general use", ...]}
        const groupedActivities = activityDetails.reduce((acc, curr) => {
            const { facilityName, activityName, activityId } = curr;
            const facility = acc.find((f) => f.facilityName === facilityName);
            if (facility) {
                facility.activityNames.push(activityName);
                facility.activityIds.push(activityId);
            } else {
                acc.push({ facilityName, activityNames: [activityName], activityIds: [activityId] });
            }
            return acc;
        }, []);    
        
        setActivityGroup(groupedActivities);

        //create an initial array with every combination of day and activity set to 0 
        const initActivityDay = daysOfWeek.map(day => {
            const activityToDay = { day };
            groupedActivities
                .filter(group => group.facilityName === selectedFacility)
                .flatMap(group => group.activityNames)
                .forEach(activity => {
                activityToDay[activity] = 0;
            });
            return activityToDay;
        });


        // create an initial array with every combination of day and facility set to 0
        const initClassDay = daysOfWeek.map(day => {
            const classToDay = { day };
            classNames.forEach(({ className }) => {
              classToDay[className] = 0;
            });
            return classToDay;
        });

        const initClassPrice = classDetails.map(classes => ({
            className: classes.className,
            classId: classes.classId,
            classRevenue : 0
        }));

        const classesData = bookingDetails
        .filter(booking => booking.bookingType === "class" &&
            moment(booking.date).isBetween(dateRange.start, dateRange.end, null, '[]')) 
        .reduce((acc, curr) => {

            const classInfo = classData.find(c => c.classId === curr.classId);
                if (!classInfo) {
                    return acc;
                }
                const className = classInfo.className;

            //change date to day
            const formatDate = new Date(curr.date);
            formatDate.setUTCHours(0, 0, 0, 0);
            const day = daysOfWeek[formatDate.getUTCDay()];
            const {noOfPeople} = curr;

            // get the index of the current day
            const currentDayIndex = daysOfWeek.findIndex(d => d === day);

            // get the index of the previous day (wrapping around to Sunday if current day is Monday)
            const previousDayIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;

            //classIndex used for Summary
            const classIndex = acc.findIndex(c => c.day === daysOfWeek[previousDayIndex]);
            acc[classIndex][className] += noOfPeople;   
            return acc;

        }, initClassDay);

        //get revenue graph data for summary
        const classPieData = bookingDetails
        .filter(booking => booking.bookingType === "class" &&
            moment(booking.date).isBetween(dateRange.start, dateRange.end, null, '[]')) 
        .reduce((acc,curr) => {

            const {classId, price} = curr;
            const classIndex = acc.findIndex(f => f.classId === classId);
            if (classIndex >= 0) {
                acc[classIndex].classRevenue += price;
              }
            return acc;
            //console.log("classId",classId);
        }, initClassPrice);

        const sumClassRevenue = classPieData.reduce((totalRevenue, classes) => {
            return totalRevenue + classes.classRevenue;
          }, 0);
          
          
        setClassRevenueData(sumClassRevenue.toFixed(1));
        


        //get usage graph data for Summary
        const summaryBarData = bookingDetails
        .filter(booking => moment(booking.date).isBetween(dateRange.start, dateRange.end, null, '[]'))
        .reduce((acc, curr) => {
            //change date to day
            const formatDate = new Date(curr.date);
            formatDate.setUTCHours(0, 0, 0, 0);
            const day = daysOfWeek[formatDate.getUTCDay()];
            const {facilityName, noOfPeople} = curr;

            //get the index of the current day
            const currentDayIndex = daysOfWeek.findIndex(d => d === day);

            // get the index of the previous day (wrapping around to Sunday if current day is Monday)
            const previousDayIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;

            //facilityIndex used for Summary
            const facilityIndex = acc.findIndex(f => f.day === daysOfWeek[previousDayIndex]);
            acc[facilityIndex][facilityName] += noOfPeople;   
            return acc;
        }, initFacDay);


        //get revenue graph data for summary
        const summaryPieData = bookingDetails
        .filter(booking => moment(booking.date).isBetween(dateRange.start, dateRange.end, null, '[]'))
        .reduce((acc,curr) => {
            const {facilityName, price} = curr;
            const facilityIndex = acc.findIndex(f => f.facilityName === facilityName);
            acc[facilityIndex].revenue += price;
            return acc;
        }, initFacPrice);

        const sumRevenue = summaryPieData.reduce((totalRevenue, facility) => {
            return totalRevenue + facility.revenue;
          }, 0);
          
        setRevenueData(sumRevenue.toFixed(1));
        // console.log("revenueData",revenueData);

        

        // chart data for activities
        const activityBarData = bookingDetails
        .filter(booking => moment(booking.date).isBetween(dateRange.start, dateRange.end, null, '[]'))
        .reduce((acc, curr) => {
            //change date to day
            const formatDate = new Date(curr.date);
            formatDate.setUTCHours(0, 0, 0, 0);
            const day = daysOfWeek[formatDate.getUTCDay()];
            const {noOfPeople , activityId, facilityName, bookingType} = curr;
            // console.log("curr",curr);

            //Makes sure it is activity
            if (bookingType !== "activity"){
                return acc;
            }

            //Makes sure only add if facility name is same
            if (facilityName !== selectedFacility) {
                return acc;
            }
            //Get activity name
            const bookingFindActivity = groupedActivities.find(f => f.facilityName === facilityName);
            // console.log("bookingfindac:",bookingFindActivity);
            const bookingToIndex = bookingFindActivity.activityIds.findIndex(id => id === activityId);
            // console.log("bookingToIndex:",bookingToIndex);
            const activityName = bookingFindActivity.activityNames[bookingToIndex];
            // console.log("activityName:",activityName);

            //get the index of the current day
            const currentDayIndex = daysOfWeek.findIndex(d => d === day);

            // get the index of the previous day (wrapping around to Sunday if current day is Monday)
            const previousDayIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;

            // console.log("acc test",acc);
            //dayIndex used for each activity
            const dayIndex = acc.findIndex(a => a.day === daysOfWeek[previousDayIndex]);
            // console.log("acc day index:",acc[dayIndex]);
            
            acc[dayIndex][activityName] += noOfPeople;     
            return acc;
        }, initActivityDay);

        selectedFacility === "Summary" ? setBarChartData(summaryBarData):
        selectedFacility === "Studio" ? setBarChartData(classesData) :
        setBarChartData(activityBarData); 
        
        selectedFacility === "Summary" ? setPieChartData(summaryPieData) :
        setPieChartData(classPieData);

        
    }, [bookingDetails,activityDetails,selectedFacility,classData,dateRange.end,dateRange.start, classNames, classDetails]);



    //Colors for graph
    const colors = ["#fd7f6f", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#8bd3c7","#fdcce5"];
    
    return (
        <Fragment>
        <Navbar />
        <div className="statistics">
            <div className="statsWrapper">
                <div className="statsDescription">
                    <h3>Usage and Revenue</h3>
                    <p>Select a facility to view usage.</p>
                </div>
                <div className="statsChooseDate">
                    <div className="statsDateArrow left">
                        <button onClick={handleBackWeek}>
                            {'<'}
                        </button>
                    </div>
                    <p>{dateRange.start.format('D/M/YYYY')} - {dateRange.end.format('D/M/YYYY')}</p>
                    <div className="statsDateArrow right">
                        <button onClick={handleForwardWeek}>
                            {'>'}
                        </button> 
                    </div> 
                </div>
                <div className="statsBottom">
                    <div className="statsLeft">
                        <ul className="statsNavList">
                            <li className="statsNavItem">
                                <button className="statsNavButton" onClick={() => handleFacilityClick("Summary")}>
                                    Summary
                                </button>
                            </li>
                            <li className="statsNavItem">
                                <button className="statsNavButton" onClick={() => handleFacilityClick("Studio")}>
                                    Studio
                                </button>
                            </li>
                            <li className="statsNavItem">
                                <button className="statsNavButton" onClick={() => handleFacilityClick("Swimming pool")}>
                                    Swimming pool
                                </button>
                            </li>
                            <li className="statsNavItem">
                                <button className="statsNavButton" onClick={() => handleFacilityClick("Fitness room")}>
                                    Fitness room
                                </button>
                            </li>
                            <li className="statsNavItem">
                                <button className="statsNavButton" onClick={() => handleFacilityClick("Sports hall")}>
                                    Sports hall
                                </button>
                            </li>
                            <li className="statsNavItem">
                                <button className="statsNavButton" onClick={() => handleFacilityClick("Squash court A")}>
                                    Squash court A
                                </button>
                            </li>
                            <li className="statsNavItem">
                                <button className="statsNavButton" onClick={() => handleFacilityClick("Squash court B")}>
                                    Squash court B
                                </button>
                            </li>
                            <li className="statsNavItem">
                                <button className="statsNavButton" onClick={() => handleFacilityClick("Climbing wall")}>
                                    Climbing wall
                                </button>
                            </li>
                        </ul>        
                    </div>
                    <div className="statsRight">
                        <div className="usage">
                            <h3>
                                {selectedFacility} 
                            </h3>
                             <div className="usageGraph">
                                <BarChart
                                    width={900}
                                    height={400}
                                    data={barChartData}
                                    margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    {selectedFacility === "Summary" ? facilityDetails.map((facility,index)=>(
                                        <Bar dataKey={facility.facilityName} stackId="day" fill={colors[index]} legendType="circle" /> //change fill color later
                                    )) : 
                                    selectedFacility === "Studio" ? (
                                        classNames.map((classes,index) => (
                                            <Bar
                                                dataKey = {classes.className}
                                                stackId = "day"
                                                fill = {colors[index]}
                                                legendType = "circle"
                                            />
                                        ))
                                    ):
                                    activityGroup.filter(group => group.facilityName === selectedFacility)[0].activityNames.map((activity,index)=>(
                                        <Bar dataKey={activity} stackId="day" fill={colors[index]} legendType="circle" />
                                    ))}
                                </BarChart>
                            </div>
                        </div>
                        <div className="revenue">
                            {selectedFacility === "Summary" && <h3>Revenue</h3>}
                            {selectedFacility === "Summary" && <p>Total revenue: £{revenueData}</p>}
                            {selectedFacility === "Studio" && <h3>Revenue</h3>}
                            {selectedFacility === "Studio" && <p>Total revenue: £{classRevenueData}</p>}
                            <div className="revenueGraph">
                                <PieChart width={900} height={300}>
                                    {selectedFacility === "Summary" && facilityDetails.map((facility,index)=>(
                                        <Pie
                                            dataKey="revenue"
                                            nameKey = "facilityName"
                                            isAnimationActive={true}
                                            data={pieChartData}
                                            outerRadius={80}
                                            fill={colors[index]}
                                            label
                                        />
                                    ))}
                                    {selectedFacility === "Studio" && classNames.map((classNames,index)=>(
                                        <Pie
                                            dataKey="classRevenue"
                                            nameKey = "className"
                                            isAnimationActive={true}
                                            data={pieChartData}
                                            outerRadius={80}
                                            fill={colors[index]}
                                            label
                                        />
                                    ))}
                                    <Tooltip />
                                </PieChart>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Fragment>
    );
};
export default Statistics;
