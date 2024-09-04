import { useState } from "react";
import axios from "axios";
import "./App.css";
import { useEffect } from "react";
import "animate.css";
import { Header } from "./components/Header";
import {
  Alert,
  Box,
  Button,
  createTheme,
  Divider,
  Snackbar,
  TextField,
  ThemeProvider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { LoginSlider } from "./components/LoginSlider";
import logo from "./assets/Logo.png";
import { ring2 } from "ldrs";
import { Loading } from "./components/Loading";
ring2.register();

export const App = () => {
  const email = new URLSearchParams(window.location.search).get("email");
  const [open, setOpen] = useState(null);
  const [loginData, setLoginData] = useState({
    email: "",
  });
  const localEmail = localStorage.getItem("wise_email");
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const newtheme = useTheme();
  const isMobile = useMediaQuery(newtheme.breakpoints.down("sm"));

  const handleLoginDataChange = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleKeyDown = (e, email) => {
    if (e.key === "Enter") {
      handleUserLoginWithEmail(email);
    }
  };

  const handleUserLoginWithEmail = async (emailParam) => {
    if (!emailRegex.test(emailParam)) {
      setOpen("email");
      return;
    }
    try {
      setMode("");
      setLoading(true);
      const url = `https://backend.wisechamps.com/quiz`;
      const res = await axios.post(url, { email: emailParam });
      const mode = res.data.mode;
      const link = res.data.link;
      if (mode !== "nouser" && !localEmail) {
        localStorage.setItem("wise_email", emailParam);
      }
      if (mode === "quizlink") {
        setMode(mode);
        window.location.assign(link);
      } else {
        setMode(mode);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setOpen("error");
      console.log("error is ------------", error);
    }
  };

  useEffect(() => {
    if (localEmail) {
      handleUserLoginWithEmail(localEmail);
    } else if (email && emailRegex.test(email)) {
      handleUserLoginWithEmail(email);
    }
    if (isMobile) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (loading && localEmail) {
    return <Loading />;
  }

  if (mode === "nocredits") {
    return (
      <>
        <Header />
        <div
          id="loadingDiv"
          style={{
            width: "fit-content",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: "8px",
          }}
          className="animate__animated animate__fadeInRight"
        >
          <p>
            You have <b>0 Sessions</b> left
          </p>
          <p>Please buy more to continue</p>

          <button
            style={{ marginTop: "10px" }}
            id="submit-btn"
            onClick={() =>
              window.open("https://students.wisechamps.com/#buy_quiz", "_blank")
            }
          >
            Add Quiz Balance
          </button>
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
            <button
              id="submit-btn"
              onClick={() => {
                localStorage.removeItem("wise_email");
                setMode("");
              }}
            >
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
                localStorage.removeItem("wise_email");
              }}
            >
              Get Your Registered Email
            </button>
          </div>
        </div>
      </>
    );
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: "#5838fc",
      },
    },
    typography: {
      fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
      h4: {
        fontWeight: "bold",
      },
      body2: {
        fontSize: "0.9rem",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        sx={{
          paddingTop: { xs: "45px", sm: "0" },
          background: "white",
          minHeight: { xs: "100vh" },
          overflow: "hidden",
          minWidth: "100vw",
          textAlign: "left",
        }}
      >
        <Snackbar
          open={open === "email"}
          autoHideDuration={3000}
          onClose={() => setOpen(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpen(null)}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Enter a Valid Email
          </Alert>
        </Snackbar>
        <Snackbar
          open={open === "error"}
          autoHideDuration={3000}
          onClose={() => setOpen(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpen(null)}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Something Went Wrong
          </Alert>
        </Snackbar>
        <Box
          position={"absolute"}
          top={"1rem"}
          left={"1rem"}
          width={{ xs: "120px", md: "180px" }}
        >
          <img
            src={logo}
            alt="Wisechamps"
            width={"120px"}
            style={{ width: "inherit" }}
          />
        </Box>
        <Grid
          size={{ xs: 12, md: 6 }}
          display={"flex"}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent={"center"}
          pt={"10px"}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "1.4rem",
              minWidth: { xs: "350px", sm: "400px" },
            }}
          >
            <Typography variant="h4" mb={1}>
              Login
            </Typography>
            <TextField
              autoFocus
              required
              margin="normal"
              fullWidth
              id="email"
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              onChange={(e) => handleLoginDataChange(e)}
              value={loginData.email}
              onKeyDown={(e) => handleKeyDown(e, loginData.email)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                mb: 2,
                p: 1.2,
                fontWeight: 600,
              }}
              onClick={() => handleUserLoginWithEmail(loginData.email)}
              disabled={!loginData.email || loading}
            >
              {loading ? (
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={1}
                >
                  <l-ring-2
                    size="20"
                    stroke="3"
                    stroke-length="0.40"
                    bg-opacity="0.1"
                    speed="0.8"
                    color="#fff"
                  ></l-ring-2>
                  <Box component={"p"}>Sign In</Box>
                </Box>
              ) : (
                "Sign in"
              )}
            </Button>

            <Divider
              textAlign="center"
              sx={{
                margin: "20px 0",
                fontSize: "13px",
                fontWeight: 700,
                color: "#696969",
              }}
            >
              New to Wisechamps
            </Divider>
            <Grid container>
              <Grid size={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ fontWeight: 700, padding: 1 }}
                  onClick={() =>
                    window.open("https://wisechamps.com", "_blank")
                  }
                >
                  Register Now
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            height: { xs: "300px", md: "100%", lg: "100%", xl: "100%" },
            overflow: "hidden",
            display: { xs: "none", md: "block" },
          }}
        >
          <LoginSlider />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
