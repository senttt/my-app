import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db, auth } from "../../../../backend/firebase";
import { Box, Grid, Alert } from "@mui/material";
import BasicInfoForm from "./basicInfoForm";
import FormButtons from "./formButtons";
import UnitSelector from "./unitSelector";
import ToggleOptions from "./toggleOptions";

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
    unitId: "",
    price: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [platformNames, setPlatformNames] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const unitsSnapshot = await getDocs(collection(db, "units"));
          const userUnits = unitsSnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((unit) => unit.members?.includes(user.uid));

          setUnits(userUnits);
          if (userUnits.length > 0) {
            setFormData((prev) => ({ ...prev, unitId: userUnits[0].id }));
            setSelectedUnit(userUnits[0]);
            setPlatformNames(
              userUnits[0].settings?.platforms.map((p) => p.name) || []
            );
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

  useEffect(() => {
    const unit = units.find((u) => u.id === formData.unitId);
    setSelectedUnit(unit);
    if (unit) {
      setPlatformNames(unit.settings?.platforms.map((p) => p.name) || []);
    }
  }, [formData.unitId, units]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.unitId) newErrors.unitId = "Please select a unit";
    if (!formData.name.trim()) newErrors.name = "Guest name is required";
    if (!formData.checkIn) newErrors.checkIn = "Check-in date is required";
    if (!formData.checkOut) newErrors.checkOut = "Check-out date is required";
    if (!selectedUnit?.settings?.isStaticPricing && !formData.price) {
      newErrors.price = "Price is required for non-static pricing";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const user = auth.currentUser;
      await addDoc(collection(db, "bookings"), {
        ...formData,
        price: formData.price ? Number(formData.price) : null,
        loggedBy: user ? user.uid : "",
        createdAt: new Date().toISOString(),
      });
      alert("Booking successfully added!");
      onClose?.();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error adding booking: " + error.message);
    }
  };

  if (loading) return <Alert severity="info">Loading available units...</Alert>;
  if (units.length === 0)
    return <Alert severity="warning">No units available.</Alert>;

  return (
    <Box component="form" sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <UnitSelector
          formData={formData}
          setFormData={setFormData}
          units={units}
          errors={errors}
        />
        <BasicInfoForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          platformNames={platformNames}
          showPriceField={!selectedUnit?.settings?.isStaticPricing}
        />
        <ToggleOptions formData={formData} setFormData={setFormData} />
        <FormButtons handleSubmit={handleSubmit} />
      </Grid>
    </Box>
  );
};

export default BookingForm;
