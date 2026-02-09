import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

const ParkingConfigurationTab = ({ settings, setSettings }) => {
  const handleParkingChange = (event) => {
    setSettings({ ...settings, parkingType: event.target.value });
  };

  const handleAmountChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="subtitle1" fontWeight="medium">
          Parking Configuration
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Owner's Payment Type Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Owner's Payment Schedule to Landlord
          </Typography>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              row
              name="parkingType"
              value={settings.parkingType || "noParking"}
              onChange={handleParkingChange}
            >
              <FormControlLabel
                value="monthly"
                control={<Radio />}
                label="Monthly Payment"
              />
              <FormControlLabel
                value="perUse"
                control={<Radio />}
                label="Per Use Payment"
              />
              <FormControlLabel
                value="noParking"
                control={<Radio />}
                label="No Parking"
              />
            </RadioGroup>
          </FormControl>
        </Box>

        {settings.parkingType !== "noParking" && (
          <>
            {/* Owner's Expense Section */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Owner's Expense to Landlord
              </Typography>

              {settings.parkingType === "monthly" && (
                <TextField
                  label="Monthly Payment to Landlord"
                  type="number"
                  fullWidth
                  value={settings.monthlyParkingFee || ""}
                  onChange={(e) =>
                    handleAmountChange("monthlyParkingFee", e.target.value)
                  }
                  helperText="Amount paid to landlord each month"
                />
              )}

              {settings.parkingType === "perUse" && (
                <TextField
                  label="Per-Use Payment to Landlord"
                  type="number"
                  fullWidth
                  value={settings.perUseParkingFee || ""}
                  onChange={(e) =>
                    handleAmountChange("perUseParkingFee", e.target.value)
                  }
                  helperText="Amount paid to landlord for each use"
                />
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Customer Charge Section */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Customer Parking Rate
              </Typography>
              <TextField
                label="Daily Rate for Customers"
                type="number"
                fullWidth
                value={settings.customerParkingRate || ""}
                onChange={(e) =>
                  handleAmountChange("customerParkingRate", e.target.value)
                }
                helperText="Amount to charge customers per day for parking"
              />
            </Box>
          </>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default ParkingConfigurationTab;
