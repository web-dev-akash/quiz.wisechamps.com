import React from "react";
import logo from "../assets/Logo.png";
import { Box } from "@mui/material";

export const Header = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "20px",
        left: "20px",
      }}
      width={{ xs: "120px", md: "180px" }}
      className="animate__animated animate__fadeInLeft"
    >
      <img
        src={logo}
        alt="Wisechamps"
        width={"120px"}
        style={{ width: "inherit" }}
      />
    </Box>
  );
};
