import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

const UnitSelector = ({ formData, setFormData, units, errors }) => {
  return (
    <FormControl fullWidth error={!!errors.unitId}>
      <InputLabel>Select Unit</InputLabel>
      <Select
        value={formData.unitId}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, unitId: e.target.value }))
        }
      >
        {units.map((unit) => (
          <MenuItem key={unit.id} value={unit.id}>
            {unit.name}
          </MenuItem>
        ))}
      </Select>
      {errors.unitId && (
        <Box sx={{ color: "error.main", fontSize: "0.75rem" }}>
          {errors.unitId}
        </Box>
      )}
    </FormControl>
  );
};

export default UnitSelector;
