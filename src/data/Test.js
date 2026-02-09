import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  MenuItem,
  Grid,
  Stack,
  Alert,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "../../../../backend/firebase";

const BookingForm = ({ onClose }) => {
  const initialFormData = {
    name: "",
    platform: "Agoda",
    checkIn: "",
    checkOut: "",
    parking: false,
    earlyCheckIn: false,
    lateCheckOut: false,
    status: "Paid",
    loggedBy: "",
    numberOfGuests: "",
    guestNames: [],
    plateNumber: "",
    contactNumber: "",
    specialRequests: "",
    unitId: "", // Add unitId to track which unit the booking belongs to
  };

  const [formData, setFormData] = useState(initialFormData);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch available units for the current user
  const [platformNames, setPlatformNames] = useState([]);
  useEffect(() => {
    const selectedUnit = units.find((unit) => unit.id === formData.unitId);
    if (selectedUnit) {
      setPlatformNames(selectedUnit.platforms.map((p) => p.name));
    }
  }, [formData.unitId, units]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          const unitsSnapshot = await getDocs(collection(db, "units"));
          const userUnits = [];

          unitsSnapshot.forEach((doc) => {
            const unitData = doc.data();
            if (unitData.members && unitData.members.includes(userId)) {
              userUnits.push({
                id: doc.id,
                name: unitData.name || `Unit ${doc.id}`,
                platforms: unitData.settings?.platforms || [],
              });
            }
          });

          setUnits(userUnits);

          if (userUnits.length > 0) {
            // Set the first unit as the default
            setFormData((prev) => ({ ...prev, unitId: userUnits[0].id }));

            // Set platforms for the first unit
            setPlatformNames(userUnits[0].platforms.map((p) => p.name));
          }
        }
      } catch (error) {
        console.error("Error fetching units:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.unitId) {
      newErrors.unitId = "Please select a unit";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Guest name is required";
    }
    if (!formData.checkIn) {
      newErrors.checkIn = "Check-in date is required";
    }
    if (!formData.checkOut) {
      newErrors.checkOut = "Check-out date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      const dataToSubmit = {
        ...formData,
        checkIn: formData.checkIn
          ? format(new Date(formData.checkIn), "MM/dd/yy")
          : "",
        checkOut: formData.checkOut
          ? format(new Date(formData.checkOut), "MM/dd/yy")
          : "",
        loggedBy: user ? user.uid : "",
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "bookings"), dataToSubmit);
      alert("Booking successfully added!");
      onClose?.();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error adding booking: " + error.message);
    }
  };

  const handleGuestCountChange = (value) => {
    const guestCount = parseInt(value, 10);

    if (!isNaN(guestCount) && guestCount >= 0) {
      setFormData({
        ...formData,
        numberOfGuests: value,
        guestNames: Array(guestCount).fill(""),
      });
    } else {
      setFormData({
        ...formData,
        numberOfGuests: "",
        guestNames: [],
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleContinue = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const renderBasicInfo = () => (
    <>
      <Grid item xs={12}>
        <FormControl fullWidth error={!!errors.unitId}>
          <InputLabel id="unit-select-label">Select Unit</InputLabel>
          <Select
            labelId="unit-select-label"
            value={formData.unitId}
            label="Select Unit"
            onChange={(e) => handleInputChange("unitId", e.target.value)}
            required
          >
            {units.map((unit) => (
              <MenuItem key={unit.id} value={unit.id}>
                {unit.name}
              </MenuItem>
            ))}
          </Select>
          {errors.unitId && (
            <Box
              sx={{
                color: "error.main",
                fontSize: "0.75rem",
                mt: 0.5,
                ml: 1.5,
              }}
            >
              {errors.unitId}
            </Box>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Guest Name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          required
          error={!!errors.name}
          helperText={errors.name}
        />
      </Grid>
      {/* Rest of the basic info fields remain the same */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          select
          label="Platform"
          value={formData.platform}
          onChange={(e) => handleInputChange("platform", e.target.value)}
        >
          {platformNames.map((platform) => (
            <MenuItem key={platform} value={platform}>
              {platform}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Check-in Date"
          type="date"
          value={formData.checkIn}
          onChange={(e) => handleInputChange("checkIn", e.target.value)}
          required
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
          onChange={(e) => handleInputChange("checkOut", e.target.value)}
          required
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
          onChange={(e) => handleInputChange("status", e.target.value)}
        >
          {["Paid", "Pending", "Unpaid"].map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={1}>
          {["parking", "earlyCheckIn", "lateCheckOut"].map((option) => (
            <FormControlLabel
              key={option}
              control={
                <Switch
                  checked={formData[option]}
                  onChange={(e) => handleInputChange(option, e.target.checked)}
                />
              }
              label={option
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            />
          ))}
        </Stack>
      </Grid>
    </>
  );

  // renderAdditionalInfo remains the same
  const renderAdditionalInfo = () => (
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
                    handleInputChange("guestNames", newGuestNames);
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
          onChange={(e) => handleInputChange("plateNumber", e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Contact Number"
          value={formData.contactNumber}
          onChange={(e) => handleInputChange("contactNumber", e.target.value)}
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
          onChange={(e) => handleInputChange("specialRequests", e.target.value)}
        />
      </Grid>
    </>
  );

  if (loading) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="info">Loading available units...</Alert>
      </Box>
    );
  }

  if (units.length === 0) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="warning">
          You don't have access to any units. Please contact your administrator.
        </Alert>
      </Box>
    );
  }

  return (
    <Box component="form" sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {step === 1 ? renderBasicInfo() : renderAdditionalInfo()}
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
              onClick={step === 1 ? handleContinue : handleSubmit}
            >
              {step === 1 ? "Continue" : "Submit Booking"}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingForm;
