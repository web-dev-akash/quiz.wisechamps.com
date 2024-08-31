/* eslint-disable react/prop-types */
import { Box } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import slider1 from "../assets/slider1.webp";
import slider3 from "../assets/slider3.webp";
import slider4 from "../assets/slider4.webp";
import slider5 from "../assets/slider5.webp";

export const LoginSlider = () => {
  const carouselItems = [
    {
      image: slider1,
    },
    {
      image: slider3,
    },
    {
      image: slider4,
    },
    {
      image: slider5,
    },
  ];

  const CarouselItem = ({ image }) => {
    return (
      <Box sx={{ height: "100%", width: "100%" }}>
        <img
          src={image}
          alt="carousel"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>
    );
  };
  return (
    <Carousel
      navButtonsAlwaysInvisible
      fullHeightHover
      autoPlay
      animation="slide"
      indicators={true}
      indicatorContainerProps={{
        style: {
          position: "absolute",
          left: 0,
          bottom: 10,
          zIndex: 9,
        },
      }}
      indicatorIconButtonProps={{ style: { color: "white" } }}
      activeIndicatorIconButtonProps={{
        style: {
          color: "#5838fc",
        },
      }}
      interval={2500}
      duration={500}
      sx={{ height: "100%" }}
      className="slider-main-div"
    >
      {carouselItems.map(({ image }, index) => (
        <CarouselItem key={index} image={image} />
      ))}
    </Carousel>
  );
};
