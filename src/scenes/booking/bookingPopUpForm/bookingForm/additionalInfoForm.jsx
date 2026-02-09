import React from "react";
import { Grid, TextField, Stack } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const AdditionalInfoForm = ({ formData, setFormData }) => {
  const handleGuestCountChange = (value) => {
    const guestCount = parseInt(value, 10);
    setFormData((prev) => ({
      ...prev,
      numberOfGuests: value,
      guestNames:
        !isNaN(guestCount) && guestCount >= 0 ? Array(guestCount).fill("") : [],
    }));
  };

  return (
    <>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Number of Guests"
          type="number"
          value={formData.numberOfGuests}
          onChange={(e) => handleGuestCountChange(e.target.value)}
          required
        />
      </Grid>

      <Grid item xs={12}>
        <Stack spacing={2}>
          <AnimatePresence>
            {formData.guestNames.map((guestName, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <TextField
                  fullWidth
                  label={`Guest ${index + 1} Name`}
                  value={guestName}
                  onChange={(e) => {
                    const newGuestNames = [...formData.guestNames];
                    newGuestNames[index] = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      guestNames: newGuestNames,
                    }));
                  }}
                  required
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Plate Number"
          value={formData.plateNumber}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, plateNumber: e.target.value }))
          }
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Contact Number"
          value={formData.contactNumber}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, contactNumber: e.target.value }))
          }
          required
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Special Requests"
          multiline
          rows={4}
          value={formData.specialRequests}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              specialRequests: e.target.value,
            }))
          }
        />
      </Grid>
    </>
  );
};

export default AdditionalInfoForm;
