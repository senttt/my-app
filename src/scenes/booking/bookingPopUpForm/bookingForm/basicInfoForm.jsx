import React from "react";
import { Grid, TextField, MenuItem } from "@mui/material";

const BasicInfoForm = ({
  formData,
  setFormData,
  errors,
  platformNames,
  showPriceField,
}) => {
  return (
    <>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Guest Name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          error={!!errors.name}
          helperText={errors.name}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          select
          label="Platform"
          value={formData.platform}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, platform: e.target.value }))
          }
        >
          {platformNames.map((platform) => (
            <MenuItem key={platform} value={platform}>
              {platform}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {showPriceField && (
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Booking Price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, price: e.target.value }))
            }
            error={!!errors.price}
            helperText={errors.price}
            InputProps={{
              startAdornment: "₱",
            }}
          />
        </Grid>
      )}

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Check-in Date"
          type="date"
          value={formData.checkIn}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, checkIn: e.target.value }))
          }
          error={!!errors.checkIn}
          helperText={errors.checkIn}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Check-out Date"
          type="date"
          value={formData.checkOut}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, checkOut: e.target.value }))
          }
          error={!!errors.checkOut}
          helperText={errors.checkOut}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          select
          label="Status"
          value={formData.status}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, status: e.target.value }))
          }
        >
          {["Paid", "Pending", "Unpaid"].map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </>
  );
};

export default BasicInfoForm;
