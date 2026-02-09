import { Box, Typography } from "@mui/material";
import React from "react";
import BookingForm from "./bookingForm/bookingForm";

const BookingPopUp = ({ onClose }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Box
      onClick={handleBackdropClick}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          backgroundColor: "background.paper",
          padding: 3,
          borderRadius: 1,
          maxWidth: "90%",
          width: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          New Booking
        </Typography>
        <BookingForm onClose={onClose} />
      </Box>
    </Box>
  );
};

export default BookingPopUp;
