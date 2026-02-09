import React from "react";
import { Button, Grid, Stack } from "@mui/material";

const FormButtons = ({ step, setStep, validateStep1, handleSubmit }) => {
  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  return (
    <Grid item xs={12}>
      <Stack direction="row" spacing={2}>
        {step === 2 && (
          <Button fullWidth variant="outlined" onClick={() => setStep(1)}>
            Back
          </Button>
        )}
        <Button
          fullWidth
          variant="contained"
          onClick={step === 1 ? handleNext : handleSubmit}
        >
          {step === 1 ? "Continue" : "Submit Booking"}
        </Button>
      </Stack>
    </Grid>
  );
};

export default FormButtons;
