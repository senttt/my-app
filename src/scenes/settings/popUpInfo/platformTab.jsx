import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  IconButton,
  Switch,
  Typography,
  Box,
  FormControlLabel,
} from "@mui/material";
import { ExpandMore, AddCircle, RemoveCircle } from "@mui/icons-material";

const PlatformTab = ({ settings, setSettings }) => {
  const handleChange = (index, field, value) => {
    const updatedPlatforms = [...settings.platforms];
    updatedPlatforms[index] = { ...updatedPlatforms[index], [field]: value };
    setSettings({ ...settings, platforms: updatedPlatforms });
  };

  const handleAddPlatform = () => {
    setSettings({
      ...settings,
      platforms: [...settings.platforms, { name: "", pricing: "" }],
    });
  };

  const handleRemovePlatform = (index) => {
    const updatedPlatforms = settings.platforms.filter((_, i) => i !== index);
    setSettings({ ...settings, platforms: updatedPlatforms });
  };

  const handlePricingTypeChange = (event) => {
    setSettings({
      ...settings,
      isStaticPricing: event.target.checked,
      // Keep existing prices for static mode, clear for custom mode
      platforms: settings.platforms.map((platform) => ({
        ...platform,
        pricing: event.target.checked ? platform.pricing : "",
      })),
    });
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>Platforms & Pricing</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Pricing Type Toggle */}
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Custom Pricing (Set during booking)
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={settings.isStaticPricing || false}
                onChange={handlePricingTypeChange}
              />
            }
            label={
              <Typography variant="subtitle2" color="text.secondary">
                Static Pricing
              </Typography>
            }
          />
        </Box>

        {/* Platform List */}
        {settings.platforms.map((platform, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              mb: 2,
            }}
          >
            <TextField
              label="Platform Name"
              value={platform.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
            />
            {settings.isStaticPricing && (
              <TextField
                label="Fixed Price"
                value={platform.pricing}
                onChange={(e) => handleChange(index, "pricing", e.target.value)}
                helperText="Set fixed price for this platform"
              />
            )}
            <IconButton
              onClick={() => handleRemovePlatform(index)}
              color="error"
            >
              <RemoveCircle />
            </IconButton>
          </Box>
        ))}

        <IconButton onClick={handleAddPlatform} color="primary" sx={{ mt: 1 }}>
          <AddCircle />
        </IconButton>
      </AccordionDetails>
    </Accordion>
  );
};

export default PlatformTab;
