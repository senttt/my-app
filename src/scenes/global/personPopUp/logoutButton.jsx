import React from "react";
import { Button, Box } from "@mui/material";
import { signOut } from "firebase/auth"; // Import Firebase signOut
import { auth } from "../../../backend/firebase"; // Import Firebase auth

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase signOut
      console.log("User logged out!");
      // Optionally, handle redirection or other actions after logout
    } catch (error) {
      console.error("Error logging out: ", error.message);
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt="20px" gap="20px">
      <Button
        color="secondary"
        variant="contained"
        onClick={handleLogout} // Call handleLogout on button click
        sx={{
          minWidth: "120px",
          padding: "10px 20px",
        }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default LogoutButton;
