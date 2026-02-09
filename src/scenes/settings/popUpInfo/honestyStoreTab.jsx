// Subcomponent: HonestyStoreTab
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  IconButton,
} from "@mui/material";
import { ExpandMore, AddCircle, RemoveCircle } from "@mui/icons-material";

const HonestyStoreTab = ({ settings, setSettings }) => {
  const handleChange = (index, field, value) => {
    const updatedItems = [...settings.honestyStore];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setSettings({ ...settings, honestyStore: updatedItems });
  };

  const handleAddItem = () => {
    setSettings({
      ...settings,
      honestyStore: [...settings.honestyStore, { name: "", price: "" }],
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = settings.honestyStore.filter((_, i) => i !== index);
    setSettings({ ...settings, honestyStore: updatedItems });
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        Honesty Store
      </AccordionSummary>
      <AccordionDetails>
        {settings.honestyStore.map((item, index) => (
          <div
            key={index}
            style={{ display: "flex", gap: "10px", alignItems: "center" }}
          >
            <TextField
              label="Item Name"
              value={item.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
            />
            <TextField
              label="Price"
              value={item.price}
              onChange={(e) => handleChange(index, "price", e.target.value)}
            />
            <IconButton onClick={() => handleRemoveItem(index)}>
              <RemoveCircle />
            </IconButton>
          </div>
        ))}
        <IconButton onClick={handleAddItem}>
          <AddCircle />
        </IconButton>
      </AccordionDetails>
    </Accordion>
  );
};

export default HonestyStoreTab;
