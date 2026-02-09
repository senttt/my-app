import React, { useState, useEffect } from "react";
import { db, auth } from "../../backend/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  Button,
  TextField,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { ContentCopy, Refresh, MoreVert } from "@mui/icons-material";
import PopUpInfo from "./popUpInfo";

function Settings() {
  const [units, setUnits] = useState([]);
  const [newUnitName, setNewUnitName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showInfoPopUp, setShowInfoPopUp] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const fetchUserUnits = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const userUnitsQuery = query(
        collection(db, "units"),
        where("members", "array-contains", userId)
      );

      const querySnapshot = await getDocs(userUnitsQuery);
      const unitsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUnits(unitsData);
    } catch (error) {
      showAlert("Error fetching units", "error");
    }
  };

  useEffect(() => {
    fetchUserUnits();
  }, []);

  const generateInviteCode = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const createUnit = async () => {
    try {
      const userId = auth.currentUser?.uid;
      const userDisplayName = auth.currentUser?.displayName || "Unknown User";
      const userEmail = auth.currentUser?.email;

      if (!userId || !newUnitName.trim()) return;

      const generatedInviteCode = generateInviteCode();

      const unitData = {
        name: newUnitName.trim(),
        adminId: userId,
        members: [userId],
        memberDetails: {
          [userId]: {
            displayName: userDisplayName,
            email: userEmail,
          },
        },
        inviteCode: generatedInviteCode,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "units"), unitData);
      setNewUnitName("");
      showAlert("Unit created successfully", "success");
      fetchUserUnits();
    } catch (error) {
      showAlert("Error creating unit", "error");
    }
  };

  const joinUnit = async () => {
    try {
      const userId = auth.currentUser?.uid;
      const userDisplayName = auth.currentUser?.displayName || "Unknown User";
      const userEmail = auth.currentUser?.email;

      if (!userId || !joinCode.trim()) return;

      const unitsQuery = query(
        collection(db, "units"),
        where("inviteCode", "==", joinCode.trim())
      );

      const querySnapshot = await getDocs(unitsQuery);

      if (querySnapshot.empty) {
        showAlert("Invalid invite code", "error");
        return;
      }

      const unitDoc = querySnapshot.docs[0];
      const unitData = unitDoc.data();

      if (unitData.members.includes(userId)) {
        showAlert("You are already a member of this unit", "warning");
        return;
      }

      const updatedMemberDetails = {
        ...unitData.memberDetails,
        [userId]: {
          displayName: userDisplayName,
          email: userEmail,
        },
      };

      await updateDoc(doc(db, "units", unitDoc.id), {
        members: [...unitData.members, userId],
        memberDetails: updatedMemberDetails,
      });

      setJoinCode("");
      showAlert("Successfully joined unit", "success");
      fetchUserUnits();
    } catch (error) {
      showAlert("Error joining unit", "error");
    }
  };

  const handleMenuClick = (event, unit) => {
    setSelectedUnit(unit);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMoreOption = () => {
    setShowInfoPopUp(true);
    handleMenuClose();
  };
  const handleDeleteUnit = async () => {
    try {
      if (!isAdmin(selectedUnit)) {
        showAlert("Only admin can delete units", "error");
        return;
      }
      await deleteDoc(doc(db, "units", selectedUnit.id));
      showAlert("Unit deleted successfully", "success");
      fetchUserUnits();
    } catch (error) {
      showAlert("Error deleting unit", "error");
    }
    handleMenuClose();
  };
  const showInviteCode = (unit) => {
    setSelectedUnit(unit);
    setInviteCode(unit.inviteCode);
    setOpenDialog(true);
  };
  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      showAlert("Invite code copied to clipboard", "success");
    } catch (error) {
      showAlert("Failed to copy invite code", "error");
    }
  };

  const regenerateInviteCode = async () => {
    try {
      const newCode = generateInviteCode();

      await updateDoc(doc(db, "units", selectedUnit.id), {
        inviteCode: newCode,
      });

      setInviteCode(newCode);
      const updatedUnit = { ...selectedUnit, inviteCode: newCode };
      setSelectedUnit(updatedUnit);
      setUnits(
        units.map((unit) => (unit.id === selectedUnit.id ? updatedUnit : unit))
      );

      showAlert("New invite code generated successfully", "success");
    } catch (error) {
      showAlert("Error generating new invite code", "error");
    }
  };

  const isAdmin = (unit) => {
    return unit.adminId === auth.currentUser?.uid;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Unit Management
      </Typography>

      {/* Create Unit Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Create New Unit
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            label="Unit Name"
            value={newUnitName}
            onChange={(e) => setNewUnitName(e.target.value)}
          />
          <Button variant="contained" onClick={createUnit}>
            Create
          </Button>
        </Box>
      </Box>

      {/* Join Unit Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Join Unit
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            label="Invite Code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
          />
          <Button variant="contained" onClick={joinUnit}>
            Join
          </Button>
        </Box>
      </Box>

      {/* Units List */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Your Units
        </Typography>
        <List>
          {units.map((unit) => (
            <ListItem
              key={unit.id}
              secondaryAction={
                <Box sx={{ display: "flex", gap: 1 }}>
                  {isAdmin(unit) && (
                    <IconButton onClick={(e) => handleMenuClick(e, unit)}>
                      <MoreVert />
                    </IconButton>
                  )}
                  {isAdmin(unit) && (
                    <Button onClick={() => showInviteCode(unit)}>
                      Show Invite Code
                    </Button>
                  )}
                </Box>
              }
            >
              <ListItemText
                primary={unit.name}
                secondary={isAdmin(unit) ? "Admin" : "Member"}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Three Dot Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMoreOption}>More</MenuItem>
        <MenuItem onClick={handleDeleteUnit}>Delete</MenuItem>
      </Menu>

      {/* Invite Code Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Invite Code</DialogTitle>
        <DialogContent>
          <Typography>
            Share this code to invite others to join {selectedUnit?.name}:
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 2,
              p: 2,
              bgcolor: "grey.100",
              borderRadius: 1,
            }}
          >
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {inviteCode}
            </Typography>
            <IconButton onClick={copyInviteCode} size="small" color="primary">
              <ContentCopy />
            </IconButton>
            <IconButton
              onClick={regenerateInviteCode}
              size="small"
              color="primary"
            >
              <Refresh />
            </IconButton>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Generating a new code will invalidate the current one
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Info PopUp */}
      {showInfoPopUp && selectedUnit && (
        <PopUpInfo
          unit={selectedUnit}
          onClose={() => setShowInfoPopUp(false)}
        />
      )}

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          severity={alert.severity}
          onClose={() => setAlert({ ...alert, open: false })}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Settings;
