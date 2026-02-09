import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db } from "../../../backend/firebase";

const BookingPopUp = ({ onClose, booking, unitData }) => {
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [honestyItems, setHonestyItems] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Get honesty store items from unit settings
    if (unitData?.settings?.honestyStore) {
      setHonestyItems(unitData.settings.honestyStore);
    }

    // Fetch existing purchased items
    fetchPurchasedItems();
  }, [unitData, booking]);

  const fetchPurchasedItems = async () => {
    if (!booking.id) return;

    const q = query(
      collection(db, "honestyStorePurchases"),
      where("bookingId", "==", booking.id)
    );

    const querySnapshot = await getDocs(q);
    const items = [];
    let total = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({ id: doc.id, ...data });
      total += data.amount * data.quantity;
    });

    setPurchasedItems(items);
    setTotalAmount(total);
  };

  const handleAddItem = async () => {
    if (!selectedItem || quantity < 1) return;

    const itemDetails = honestyItems.find((item) => item.name === selectedItem);
    if (!itemDetails) return;

    const newPurchase = {
      bookingId: booking.id,
      item: selectedItem,
      quantity: quantity,
      amount: parseFloat(itemDetails.price),
      timestamp: new Date(),
    };

    try {
      await addDoc(collection(db, "honestyStorePurchases"), newPurchase);
      await fetchPurchasedItems();

      // Reset form
      setSelectedItem("");
      setQuantity(1);
    } catch (error) {
      console.error("Error adding honesty store item:", error);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Box
      onClick={handleBackdropClick}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          backgroundColor: "background.paper",
          padding: 3,
          borderRadius: 1,
          maxWidth: "90%",
          width: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Booking Details - {booking.name}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>
          Honesty Store Items
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Item</InputLabel>
            <Select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              label="Item"
            >
              {honestyItems.map((item) => (
                <MenuItem key={item.name} value={item.name}>
                  {item.name} - ₱{item.price}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            type="number"
            label="Quantity"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 0))
            }
            sx={{ width: "120px" }}
          />

          <Button
            variant="contained"
            onClick={handleAddItem}
            disabled={!selectedItem}
          >
            Add
          </Button>
        </Box>

        <List>
          {purchasedItems.map((item) => (
            <ListItem key={item.id}>
              <ListItemText
                primary={item.item}
                secondary={`Quantity: ${item.quantity} | ₱${
                  item.amount * item.quantity
                }`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Total Amount: ₱{totalAmount}</Typography>
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default BookingPopUp;
