import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

function Main(props) {
  console.log(props);
  const { userId, setUserId } = props;
  const { username, setUsername } = props;
  const { user, setUser } = props;
  const {setIsAuthenticated} = props;
  const [report, setReport] = useState({});
  const [dailyReportRequired, setDailyReportRequired] = useState(false);
  const { role, setRole } = props;

  console.log("user._id: " + userId);

  const deleteCookie = async () => {
    try {
      await axios.get("/signout");
      setIsAuthenticated(false);
      setRole("");
    } catch (e) {
      console.log(e);
    }
  };
  const addDailyReport = () => {
    props.history.push({
      pathname: "/dailyReportForm",
      state: {
        role: role,
        username: username,
      },
    });
  };

  const getLatestReport = async () => {
    console.log("in getLatestReport. userId: " + userId);
    const url = "http://localhost:3000/api/dailyReports/latest/users/" + userId;
    try {
      const response = await axios.get(url);
      console.log("response:"+response);

      if (!response.data.message == "No records found") {
        console.log("No old records for user: " + username);
        setDailyReportRequired(true);
        return false;
      } else {
        
        //if no timestamps in the response display add report button
        if (!response.data.createdAt || response.data.createdAt == null) {
          setDailyReportRequired(true);
        } else {
          //display the add report button only if the user have not added daily report for 24 hours
          console.log("response.data: " + response.data);
          console.log("Response.data.createdAt" + response.data.createdAt);
          setReport(response.data);
          setDailyReportRequired(false);
          var createdAt = new Date(response.data.createdAt);
          console.log("Converted createdAt: " + createdAt);
          var dateNow = new Date();
          console.log("date Now: " + dateNow);
          var timeDifference = Math.abs(dateNow - createdAt);
          console.log("dateDifference: " + timeDifference);
          var dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
          console.log("dayDifference: " + dayDifference);
          if (dayDifference > 1) {
            setDailyReportRequired(true);
          } else {
            setDailyReportRequired(false);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };


  // const getListOfPreviousVisits = async()=>{
  //   const url = ""
  // };

  useEffect(() => {
    if (role == "patient") {
      getLatestReport();
    }
    // if (role=="nurse"){

    // }
  }, []);

  return (
    <div>
      <h1>
        Hi, {role} {username}
      </h1>
      <Button className="btn btn-danger" onClick={deleteCookie}>
        Log Out
      </Button>
      {role == "patient" ? (
        <div>
          {dailyReportRequired == true ? (
            <div>
              <Button className="btn btn-primary" onClick={addDailyReport}>
                Add Report
              </Button>
            </div>
          ) : (
            <div>
              {/* {code if daily report not required} */}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2>Previous clinical Information</h2>
          <ListGroup>

          </ListGroup>
        </div>
      )}
    </div>
  );
}

export default withRouter(Main);
