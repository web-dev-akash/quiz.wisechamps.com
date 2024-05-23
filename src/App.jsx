import { useState } from "react";
import { RaceBy } from "@uiball/loaders";
import axios from "axios";
import "./App.css";
import { useEffect } from "react";
import "animate.css";
import { Header } from "./components/Header";
export const App = () => {
  const query = new URLSearchParams(window.location.search);
  const [email, setEmail] = useState(query.get("email"));
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [credits, setCredits] = useState(0);
  const [username, setUsername] = useState("");
  const [grade, setGrade] = useState("");
  const [link, setLink] = useState("");
  const [address, setAddress] = useState("");
  const emailRegex = new RegExp(
    /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,
    "gm"
  );
  const handleChange = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const handleClick = async (emailParam) => {
    if (!emailRegex.test(emailParam)) {
      alert("Please Enter a Valid Email");
      window.location.reload();
      return;
    }
    try {
      setMode("");
      setLoading(true);
      const url = `https://backend.wisechamps.com/quiz`;
      const res = await axios.post(url, { email: emailParam });
      const mode = res.data.mode;
      const link = res.data.link;
      const credits = res.data.credits;
      const grade = res.data.grade;
      const address = res.data.address;
      if (mode === "quizlink") {
        setMode(mode);
        setGrade(grade);
        setCredits(credits);
        setLink(link);
        setAddress(address);
        window.location.assign(link);
      } else {
        setMode(mode);
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
      handleClick(email);
    }
  }, []);

  if (loading) {
    return (
      <div
        id="loadingDiv"
        style={{
          width: "fit-content",
        }}
      >
        <p>{"Redirecting You to Quiz.."}</p>
        <RaceBy
          size={300}
          lineWeight={20}
          speed={1.4}
          color="rgba(129, 140, 248)"
        />
      </div>
    );
  }

  if (error || mode.includes("internalservererror")) {
    return (
      <div>
        <h1>Something Went Wrong. Please Refresh</h1>
      </div>
    );
  }

  if (mode === "quizlink") {
    return (
      <div
        id="loadingDiv"
        style={{
          width: "fit-content",
        }}
      >
        <p>Redirecting You to Quiz..</p>
        <RaceBy
          size={300}
          lineWeight={20}
          speed={1.4}
          color="rgba(129, 140, 248)"
        />
      </div>
    );
  }

  if (mode === "nocredits") {
    return (
      <>
        <Header />
        <div
          id="loadingDiv"
          style={{
            width: "fit-content",
          }}
          className="animate__animated animate__fadeInRight"
        >
          <p>You have already used your Quiz Balance</p>
          <p>Please buy more and try again.</p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <button
              id="submit-btn"
              onClick={() =>
                window.location.assign(
                  `https://quizbalance.wisechamps.com?email=${email}`
                )
              }
            >
              Buy Quiz Balance
            </button>
          </div>
        </div>
      </>
    );
  }

  if (mode === "nosession") {
    return (
      <>
        <Header />
        <div className="animate__animated animate__fadeInRight">
          <p>
            It appears that there is no active
            <br />
            session at this moment.
          </p>
        </div>
      </>
    );
  }

  if (mode === "nouser") {
    return (
      <>
        <Header />
        <div className="email-not-found">
          <p>
            This Email is not registered with us. <br />
            Please use a registered Email Address
          </p>
          <div>
            <button id="submit-btn" onClick={() => setMode("")}>
              Try Again
            </button>
            <button
              id="submit-btn"
              onClick={() => {
                window.open(
                  `https://wa.me/919717094422?text=${encodeURIComponent(
                    "Please send me my registered email"
                  )}`,
                  "_blank"
                );
                setMode("");
              }}
            >
              Get Your Registered Email
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="main animate__animated animate__fadeInRight">
        <h3>Email</h3>
        <div className="form">
          <input
            className="input"
            type="email"
            placeholder="Enter Email"
            inputMode="email"
            onChange={handleChange}
          />
          <p>* Please use the registered Email.</p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <button id="submit-btn" onClick={() => handleClick(email)}>
              Join Quiz
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
