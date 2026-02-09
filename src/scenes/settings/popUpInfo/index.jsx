// Main Component: SettingPopUp
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../../backend/firebase";
import PlatformTab from "./platformTab";
import CheckInOutTab from "./checkInOutTab";
import HonestyStoreTab from "./honestyStoreTab";
import ExpensesTab from "./expensesTab";
import ParkingConfigurationTab from "./parkingConfigurationTab"; // Import this component
const SettingPopUp = ({ onClose, unit }) => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    platforms: [],
    honestyStore: [],
    monthlyExpenses: [],
    perUseExpenses: [],
    honestyExpenses: [],
    checkInTime: "",
    checkOutTime: "",
    earlyCheckInFee: "",
    lateCheckOutFee: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, "units", unit.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.settings) {
          setSettings(data.settings);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching settings:", error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, "units", unit.id);
      await updateDoc(docRef, { settings });
      onClose();
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h5">Unit Settings</Typography>
      <PlatformTab settings={settings} setSettings={setSettings} />
      <CheckInOutTab settings={settings} setSettings={setSettings} />
      <HonestyStoreTab settings={settings} setSettings={setSettings} />
      <ParkingConfigurationTab settings={settings} setSettings={setSettings} />
      <ExpensesTab
        settings={settings}
        setSettings={setSettings}
        expenseType="monthlyExpenses"
        title="Monthly Expenses"
      />
      <ExpensesTab
        settings={settings}
        setSettings={setSettings}
        expenseType="perUseExpenses"
        title="Per-Use Expenses"
      />
      <ExpensesTab
        settings={settings}
        setSettings={setSettings}
        expenseType="honestyExpenses"
        title="Honesty Store Expenses"
      />
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default SettingPopUp;
