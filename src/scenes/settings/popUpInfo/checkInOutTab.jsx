// Subcomponent: CheckInOutTab
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

const CheckInOutTab = ({ settings, setSettings }) => {
  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        Check-in & Check-out
      </AccordionSummary>
      <AccordionDetails>
        <TextField
          label="Check-in Time"
          type="time"
          value={settings.checkInTime}
          onChange={(e) => handleChange("checkInTime", e.target.value)}
        />
        <TextField
          label="Check-out Time"
          type="time"
          value={settings.checkOutTime}
          onChange={(e) => handleChange("checkOutTime", e.target.value)}
        />
        <TextField
          label="Early Check-in Fee"
          value={settings.earlyCheckInFee}
          onChange={(e) => handleChange("earlyCheckInFee", e.target.value)}
        />
        <TextField
          label="Late Check-out Fee"
          value={settings.lateCheckOutFee}
          onChange={(e) => handleChange("lateCheckOutFee", e.target.value)}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default CheckInOutTab;
