import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useState } from "react"; // Added useState
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import PersonPopUp from "./personPopUp";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

const Topbar = ({ isAuth }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [showPersonPopUp, setShowPersonPopUp] = useState(false);

  const navigate = useNavigate(); // Initialize navigate

  const togglePersonPopUp = () => {
    setShowPersonPopUp(!showPersonPopUp);
  };

  const handleSettingsClick = () => {
    navigate("/settings"); // Navigate to the settings page
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" p={2}>
        {/* SEARCH BAR */}
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
        >
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>

        {/* ICONS */}
        <Box display="flex">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
          <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton>
          <IconButton onClick={handleSettingsClick}>
            {" "}
            {/* Added onClick handler */}
            <SettingsOutlinedIcon />
          </IconButton>
          <IconButton onClick={togglePersonPopUp}>
            <PersonOutlinedIcon />
          </IconButton>
        </Box>
      </Box>

      {showPersonPopUp && (
        <PersonPopUp isAuth={isAuth} onClose={togglePersonPopUp} />
      )}
    </>
  );
};

export default Topbar;
