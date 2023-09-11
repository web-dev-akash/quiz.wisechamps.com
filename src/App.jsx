import { useEffect, useState } from "react";
import { DotPulse } from "@uiball/loaders";
import emailNotFound from "./assets/4044.gif";
import axios from "axios";
import "./App.css";

export const App = () => {
  const wstoken = process.env.REACT_APP_WS_TOKEN;
  const wsfunction = process.env.REACT_APP_WS_FUNCTION;
  const query = new URLSearchParams(window.location.search).get("email");
  const [email, setEmail] = useState(query);
  const [mode, setMode] = useState("");
  const [date, setDate] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getLoginLink = async (email) => {
    try {
      setLoading(true);
      const url = `http://ec2-65-2-78-220.ap-south-1.compute.amazonaws.com/quiz?email=${email}`;
      const res = await axios.get(url);
      const link = res.data.link;
      const mode = res.data.mode;
      if (mode === "quizlink") {
        setMode("quizlink");
        const url = `https://wisechamps.app/webservice/rest/server.php?wstoken=${wstoken}&wsfunction=${wsfunction}&user[email]=${email}&moodlewsrestformat=json`;
        const res = await axios.get(url);
        const loginLink = res.data.loginurl;
        window.location.replace(loginLink, "_blank");
        window.open(link, "_balnk");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log("error is ------------", error);
    }
  };

  useEffect(() => {
    if (email) {
      getLoginLink(email);
    }
  }, []);

  if (!email || !query) {
    return (
      <div>
        <div
          style={{
            width: "300px",
            height: "150px",
            backgroundImage: `url(${emailNotFound})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            marginBottom: "20px",
            marginTop: "-100px",
          }}
        ></div>
        <h1
          style={{
            color: "#140B6A",
          }}
        >
          Email Not Found..
        </h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <DotPulse size={60} speed={1.3} color="black" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Something Went Wrong. Please Refresh</h1>
      </div>
    );
  }

  if (mode === "quizlink") {
    return (
      <div>
        <h1>Redirecting you to the Quiz Please Wait..</h1>
      </div>
    );
  }

  if (mode === "notstartedyet") {
    return (
      <div>
        <h1>
          Meeting not started yet, it will be starting on {date.date},{" "}
          {date.time}
        </h1>
      </div>
    );
  }

  if (mode === "expired") {
    return (
      <div>
        <h1>This Meeting has already Expired</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Wisechamps</h1>
    </div>
  );
};

// 1. if Parent Orientation Slot is empty redirect user to calendly to book a slot.
// 2. if there exists a Parent Orientation Slot and Joined Parent Orientation is empty then redirect the user to the zoom orientation and mark the Joined Parent Orientation
// 3. Else if Student Job Quiz Slot is empty then redirect the user to calendly again to book a slot.
// 4. Else if Student Job Quiz Slot is not empty and Job Quiz Attended Date is empty then redirect the user to the required zoomlink and login that user to the LMS in the background.
// 5. Else if Job Announcement Slot is empty then redirect the user to join the Announcement session on the coming Tuesday.

// 3 orientation links - 2 job orientations and 1 is job announcement on tuesday
