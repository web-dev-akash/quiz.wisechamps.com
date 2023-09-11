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
        window.open(link, "_blank");
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

  return (
    <div>
      <h1>Wisechamps</h1>
    </div>
  );
};
