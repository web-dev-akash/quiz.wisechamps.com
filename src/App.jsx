import { useState } from "react";
import { DotPulse } from "@uiball/loaders";
import axios from "axios";
import "./App.css";

export const App = () => {
  const wstoken = process.env.REACT_APP_WS_TOKEN;
  const wsfunction = process.env.REACT_APP_WS_FUNCTION;
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
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
      setLoading(true);
      await axios.post(
        `https://script.google.com/macros/s/AKfycbzfelbwgNpG1v4zY8t-avVggcgH3K_7yE-r7B7eTWF45lt1q_guT4qaQTaEiYccHy-b/exec?email=${emailParam}&type=quiz&description=EnteredEmail`
      );
      const url = `https://backend.wisechamps.app/quiz`;
      const res = await axios.post(url, { email: emailParam });
      const status = res.data.status;
      const mode = res.data.mode;
      const link = res.data.link;
      const email = res.data.email;
      const description = `${mode} ${status}`;
      await axios.post(
        `https://script.google.com/macros/s/AKfycbzfelbwgNpG1v4zY8t-avVggcgH3K_7yE-r7B7eTWF45lt1q_guT4qaQTaEiYccHy-b/exec?email=${emailParam}&type=quiz&description=${description}`
      );
      if (mode === "quizlink") {
        setMode("quizlink");
        const url = `https://wisechamps.app/webservice/rest/server.php?wstoken=${wstoken}&wsfunction=${wsfunction}&user[email]=${email}&moodlewsrestformat=json`;
        const res = await axios.get(url);
        await axios.post(
          `https://script.google.com/macros/s/AKfycbzfelbwgNpG1v4zY8t-avVggcgH3K_7yE-r7B7eTWF45lt1q_guT4qaQTaEiYccHy-b/exec?email=${emailParam}&type=quiz&description=LinkGenerated ${res.status}`
        );
        const loginLink = res.data.loginurl;
        const finalLink = `${loginLink}&wantsurl=${link}`;
        window.location.assign(finalLink);
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

  if (loading) {
    return (
      <div
        id="loadingDiv"
        style={{
          width: "fit-content",
        }}
      >
        <DotPulse size={60} speed={1.3} color="black" />
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
        <DotPulse size={60} speed={1.3} color="black" />
      </div>
    );
  }

  if (mode === "nosession") {
    return (
      <div>
        <p>
          It appears that there is no active
          <br />
          session at this moment.
        </p>
      </div>
    );
  }

  if (mode === "nouser") {
    setTimeout(() => {
      setMode("");
    }, 4000);
    return (
      <div>
        <p>
          This Email is not registered with us. <br />
          Please use a registered Email Address
        </p>
      </div>
    );
  }

  return (
    <div className="main">
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
        <button id="submit-btn" onClick={() => handleClick(email)}>
          Join Quiz
        </button>
      </div>
    </div>
  );
};
