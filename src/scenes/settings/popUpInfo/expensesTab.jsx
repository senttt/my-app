import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  IconButton,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { ExpandMore, AddCircle, RemoveCircle } from "@mui/icons-material";

const ExpensesTab = ({ settings, setSettings, expenseType, title }) => {
  const handleChange = (index, field, value) => {
    const updatedExpenses = [...settings[expenseType]];
    updatedExpenses[index] = { ...updatedExpenses[index], [field]: value };
    setSettings({ ...settings, [expenseType]: updatedExpenses });
  };

  const handleAddExpense = () => {
    setSettings({
      ...settings,
      [expenseType]: [...settings[expenseType], { name: "", amount: "" }],
    });
  };

  const handleRemoveExpense = (index) => {
    const updatedExpenses = settings[expenseType].filter((_, i) => i !== index);
    setSettings({ ...settings, [expenseType]: updatedExpenses });
  };

  const handleParkingChange = (event) => {
    setSettings({ ...settings, parkingType: event.target.value });
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>{title}</AccordionSummary>
      <AccordionDetails>
        {/* Only show parking configuration if it's the 'parkingExpenses' tab */}
        {expenseType === "parkingExpenses" && (
          <div>
            <h3>Parking Configuration</h3>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="parking"
                name="parking"
                value={settings.parkingType || "noParking"}
                onChange={handleParkingChange}
              >
                <FormControlLabel
                  value="perUse"
                  control={<Radio />}
                  label="Per Use"
                />
                <FormControlLabel
                  value="monthly"
                  control={<Radio />}
                  label="Monthly"
                />
                <FormControlLabel
                  value="noParking"
                  control={<Radio />}
                  label="No Parking"
                />
              </RadioGroup>
            </FormControl>
          </div>
        )}

        {settings[expenseType].map((expense, index) => (
          <div
            key={index}
            style={{ display: "flex", gap: "10px", alignItems: "center" }}
          >
            <TextField
              label="Expense Name"
              value={expense.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
            />
            <TextField
              label="Amount"
              value={expense.amount}
              onChange={(e) => handleChange(index, "amount", e.target.value)}
            />
            <IconButton onClick={() => handleRemoveExpense(index)}>
              <RemoveCircle />
            </IconButton>
          </div>
        ))}
        <IconButton onClick={handleAddExpense}>
          <AddCircle />
        </IconButton>
      </AccordionDetails>
    </Accordion>
  );
};

export default ExpensesTab;
