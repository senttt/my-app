import { Box, Typography, Link } from "@mui/material";
import React, { useState } from "react";
import Login from "../../auth/login";
import Register from "../../auth/register"; // Assuming you have the Register component
import LogoutButton from "./logoutButton";

const PersonPopUp = ({ onClose, isAuth }) => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
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
      {/* Popup Content */}
      <Box
        sx={{
          backgroundColor: "background.paper",
          padding: 2,
          borderRadius: 1,
          maxWidth: "90%",
          width: "400px",
        }}
      >
        {isAuth ? (
          <LogoutButton />
        ) : isLogin ? (
          <>
            <Login />
            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Don't have an account?{" "}
                <Link href="#" onClick={handleToggle}>
                  Register here
                </Link>
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Register />
            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Already have an account?{" "}
                <Link href="#" onClick={handleToggle}>
                  Login here
                </Link>
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default PersonPopUp;
