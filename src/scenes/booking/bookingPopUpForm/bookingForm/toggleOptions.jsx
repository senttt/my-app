import React from "react";
import { Stack, FormControlLabel, Switch } from "@mui/material";

const ToggleOptions = ({ formData, setFormData }) => {
  const toggleFields = ["parking", "earlyCheckIn", "lateCheckOut"];

  return (
    <Stack spacing={1}>
      {toggleFields.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Switch
              checked={formData[option]}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, [option]: e.target.checked }))
              }
            />
          }
          label={option
            .replace(/([A-Z])/g, " $1") // Convert camelCase to spaced words
            .replace(/^./, (str) => str.toUpperCase())} // Capitalize first letter
        />
      ))}
    </Stack>
  );
};

export default ToggleOptions;
