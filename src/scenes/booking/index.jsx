import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import BookingPopUp from "./bookingPopUpForm";
import PopUpInfo from "./popUpInfo";
import { db } from "../../backend/firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Booking = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const auth = getAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBookingPopUp, setShowBookingPopUp] = useState(false);
  const [showInfoPopUp, setShowInfoPopUp] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedUnitData, setSelectedUnitData] = useState(null);
  const [userUnits, setUserUnits] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const toggleBookingPopUp = () => setShowBookingPopUp((prev) => !prev);
  const toggleInfoPopUp = () => setShowInfoPopUp((prev) => !prev);

  const handleMoreClick = async (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);

    // Fetch the unit data when a booking is selected
    try {
      const unitDoc = await getDoc(doc(db, "units", booking.unitId));
      if (unitDoc.exists()) {
        setSelectedUnitData(unitDoc.data());
      }
    } catch (error) {
      console.error("Error fetching unit data:", error);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMoreOption = () => {
    setAnchorEl(null);
    setShowInfoPopUp(true);
  };

  const handleDeleteSingle = async (bookingId) => {
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      await fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
    setAnchorEl(null);
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedRows.map((bookingId) =>
          deleteDoc(doc(db, "bookings", bookingId))
        )
      );
      await fetchBookings();
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting bookings:", error);
    }
  };

  const fetchUserUnits = async () => {
    if (!auth.currentUser) return [];

    const userId = auth.currentUser.uid;
    const unitsSnapshot = await getDocs(collection(db, "units"));
    const accessibleUnits = [];

    unitsSnapshot.forEach((unitDoc) => {
      const unitData = unitDoc.data();
      const members = unitData.members || [];
      const memberDetails = Array.isArray(unitData.memberDetails)
        ? unitData.memberDetails
        : [];

      if (
        members.includes(userId) ||
        memberDetails.some((member) => member.id === userId)
      ) {
        accessibleUnits.push({
          id: unitDoc.id,
          name: unitData.name,
          settings: unitData.settings,
        });
      }
    });

    setUserUnits(accessibleUnits);
    return accessibleUnits;
  };

  const fetchBookings = async () => {
    setLoading(true);
    if (!auth.currentUser) return;

    const accessibleUnits = await fetchUserUnits();
    const accessibleUnitIds = accessibleUnits.map((unit) => unit.id);
    const bookingsSnapshot = await getDocs(collection(db, "bookings"));
    const processedBookings = [];

    bookingsSnapshot.forEach((bookingDoc) => {
      const bookingData = bookingDoc.data();
      if (accessibleUnitIds.includes(bookingData.unitId)) {
        const unitInfo = accessibleUnits.find(
          (unit) => unit.id === bookingData.unitId
        );
        processedBookings.push({
          id: bookingDoc.id,
          name: bookingData.name,
          Unit: unitInfo ? unitInfo.name : "N/A",
          unitId: bookingData.unitId, // Add unitId to the processed booking data
          platform: bookingData.platform,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          status: bookingData.status,
        });
      }
    });

    setBookings(processedBookings);
    setLoading(false);
  };

  useEffect(() => {
    if (auth.currentUser) fetchBookings();
  }, [showBookingPopUp, auth.currentUser]);

  const getStatusColor = (status) =>
    status === "Paid" ? colors.greenAccent[600] : colors.greenAccent[700];

  const columns = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 120 },
    { field: "Unit", headerName: "Unit", flex: 1, minWidth: 100 },
    { field: "platform", headerName: "Platform", flex: 1, minWidth: 100 },
    { field: "checkIn", headerName: "Check In", flex: 1, minWidth: 110 },
    { field: "checkOut", headerName: "Check Out", flex: 1, minWidth: 110 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 100,
      renderCell: ({ row: { status } }) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: isMobile ? "90%" : "60%",
            p: "5px",
            backgroundColor: getStatusColor(status),
            borderRadius: "4px",
            gap: 1,
          }}
        >
          {status === "Unpaid" && <AdminPanelSettingsOutlinedIcon />}
          {status === "Paid" && <SecurityOutlinedIcon />}
          <Typography color={colors.grey[100]}>{status}</Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      minWidth: 70,
      renderCell: ({ row }) => (
        <Box>
          <IconButton onClick={(e) => handleMoreClick(e, row)}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedBooking?.id === row.id}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMoreOption}>More</MenuItem>
            <MenuItem onClick={() => handleDeleteSingle(row.id)}>
              Delete
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
  ];

  return (
    <Box m={isMobile ? "10px" : "20px"}>
      <Header title="Booking" subtitle="Managing Booking Members" />
      <Box
        display="flex"
        justifyContent="space-between"
        mt={isMobile ? "10px" : "20px"}
      >
        {selectedRows.length > 0 && (
          <Button
            onClick={handleDeleteSelected}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete Selected ({selectedRows.length})
          </Button>
        )}
        <Button
          onClick={toggleBookingPopUp}
          color="secondary"
          variant="contained"
          sx={{ width: isMobile ? "100%" : "auto" }}
          disabled={userUnits.length === 0}
        >
          Add Booking
        </Button>
      </Box>
      <Box
        sx={{
          m: isMobile ? "20px 0 0 0" : "40px 0 0 0",
          height: "75vh",
          width: "100%",
          overflow: "auto",
        }}
      >
        <DataGrid
          checkboxSelection
          rows={bookings}
          columns={columns}
          pageSize={isMobile ? 5 : 10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          loading={loading}
          onSelectionModelChange={(newSelection) => {
            setSelectedRows(newSelection);
          }}
        />
      </Box>
      {showBookingPopUp && (
        <BookingPopUp onClose={toggleBookingPopUp} userUnits={userUnits} />
      )}
      {showInfoPopUp && selectedBooking && selectedUnitData && (
        <PopUpInfo
          booking={selectedBooking}
          unitData={selectedUnitData}
          onClose={toggleInfoPopUp}
        />
      )}
    </Box>
  );
};

export default Booking;
