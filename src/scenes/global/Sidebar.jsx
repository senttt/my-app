import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import {
  MenuOutlined,
  HomeOutlined,
  PeopleOutlined,
  PersonOutlined,
  CalendarTodayOutlined,
  AutoStoriesOutlined,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { tokens } from "../../theme";
import userImage from "../../assets/user.svg";
import { auth } from "../../backend/firebase"; // Import Firebase auth

const menuItems = [
  { title: "Dashboard", to: "/", icon: <HomeOutlined /> },
  { title: "Manage Team", to: "/team", icon: <PeopleOutlined /> },
  { title: "Profile", to: "/form", icon: <PersonOutlined /> },
  { title: "Calendar", to: "/calendar", icon: <CalendarTodayOutlined /> },
  { title: "Booking", to: "/booking", icon: <AutoStoriesOutlined /> },
];

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userName, setUserName] = useState(""); // Store the user's full name

  useEffect(() => {
    // Get the current user and set their display name
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || "User"); // Default to "User" if displayName is not set
    }
  }, []);

  const sidebarStyles = {
    width: isCollapsed ? 72 : 280,
    height: "100vh",
    transition: "all 0.3s ease",
    borderRight: `1px solid ${colors.primary[800]}`,
    display: { xs: "none", md: "block" },
    position: "sticky",
    top: 0,
    backgroundColor: colors.primary[400],
    overflow: "hidden",
  };

  const menuItemStyles = (isActive) => ({
    mx: isCollapsed ? 0.5 : 1,
    px: isCollapsed ? 1.5 : 2,
    py: 1.5,
    borderRadius: "10px",
    backgroundColor: isActive ? colors.primary[600] : "transparent",
    color: isActive ? colors.grey[100] : colors.grey[200],
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: colors.primary[500],
      transform: "translateX(4px)",
    },
    ".MuiListItemIcon-root": {
      minWidth: isCollapsed ? 32 : 40,
      color: "inherit",
    },
  });

  const CollapseButton = () => (
    <IconButton
      onClick={() => setIsCollapsed(!isCollapsed)}
      sx={{
        backgroundColor: colors.primary[500],
        borderRadius: "50%",
        position: "absolute",
        right: isCollapsed ? "50%" : 16,
        bottom: 20,
        transform: isCollapsed ? "translateX(50%)" : "none",
        "&:hover": { backgroundColor: colors.primary[600] },
      }}
    >
      {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
    </IconButton>
  );

  return (
    <>
      <Box sx={sidebarStyles}>
        <Box
          sx={{
            p: isCollapsed ? 1 : 2,
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
            height: 64,
          }}
        >
          {!isCollapsed && (
            <Typography variant="h5" fontWeight="bold">
              ADMINIS
            </Typography>
          )}
        </Box>

        {!isCollapsed && (
          <Box
            sx={{
              textAlign: "center",
              p: 2,
              mb: 2,
            }}
          >
            <Box
              component="img"
              src={userImage}
              alt="Profile"
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                mb: 1,
                border: `2px solid ${colors.primary[500]}`,
              }}
            />
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              {userName} {/* Display the user’s full name */}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.grey[300] }}>
              VP Fancy Admin
            </Typography>
          </Box>
        )}

        <List sx={{ px: isCollapsed ? 1 : 2 }}>
          {menuItems.map(({ title, to, icon }) => (
            <Tooltip
              key={title}
              title={isCollapsed ? title : ""}
              placement="right"
              arrow
            >
              <ListItem
                component={Link}
                to={to}
                sx={menuItemStyles(location.pathname === to)}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                {!isCollapsed && <ListItemText primary={title} />}
              </ListItem>
            </Tooltip>
          ))}
        </List>

        <CollapseButton />
      </Box>

      {isMobile && (
        <>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
              backgroundColor: colors.primary[400],
              color: colors.grey[100],
              zIndex: 1000,
              boxShadow: theme.shadows[4],
              "&:hover": {
                backgroundColor: colors.primary[500],
              },
            }}
          >
            <MenuOutlined />
          </IconButton>

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                backgroundColor: colors.primary[400],
                width: 280,
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <List>
                {menuItems.map(({ title, to, icon }) => (
                  <ListItem
                    key={title}
                    component={Link}
                    to={to}
                    sx={menuItemStyles(location.pathname === to)}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={title} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
        </>
      )}
    </>
  );
};

export default Sidebar;
