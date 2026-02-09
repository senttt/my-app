import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { auth, onAuthStateChanged } from "./backend/firebase"; // Import Firebase auth

import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Form from "./scenes/form";
import Booking from "./scenes/booking";
import Calendar from "./scenes/calendar/calendar";
import Front from "./scenes/front";
import Settings from "./scenes/settings";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuth(!!user); // If user exists, set isAuth to true
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {isAuth && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            <Topbar isAuth={isAuth} setIsSidebar={setIsSidebar} />

            {isAuth ? (
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/team" element={<Team />} />
                <Route path="/form" element={<Form />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            ) : (
              <Front />
            )}
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
