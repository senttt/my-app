import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import { formatDate } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Drawer,
  Alert,
  Tooltip,
} from "@mui/material";
import { DeleteOutline, Event, Close } from "@mui/icons-material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { db } from "../../backend/firebase";
import { collection, getDocs } from "firebase/firestore";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentEvents, setCurrentEvents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsCollection = collection(db, "bookings");
        const bookingsSnapshot = await getDocs(bookingsCollection);
        const bookingsData = bookingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Convert bookings to calendar events
        const calendarEvents = bookingsData.map((booking) => ({
          id: booking.id,
          title: `${booking.name} (${booking.numberOfGuests} guests)`,
          start: new Date(booking.checkIn).toISOString(),
          end: new Date(booking.checkOut).toISOString(),
          extendedProps: {
            guestNames: booking.guestNames,
            contactNumber: booking.contactNumber,
            platform: booking.platform,
            status: booking.status,
            earlyCheckIn: booking.earlyCheckIn,
            lateCheckOut: booking.lateCheckOut,
            parking: booking.parking,
            plateNumber: booking.plateNumber,
            specialRequests: booking.specialRequests,
          },
          backgroundColor:
            booking.status === "Paid"
              ? colors.greenAccent[500]
              : colors.primary[500],
          borderColor:
            booking.status === "Paid"
              ? colors.greenAccent[700]
              : colors.primary[700],
        }));

        setCurrentEvents(calendarEvents);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setShowAlert(true);
        setAlertMessage("Error loading bookings");
        setTimeout(() => setShowAlert(false), 3000);
      }
    };

    fetchBookings();
  }, [colors.greenAccent, colors.primary]);

  const handleDateClick = (selected) => {
    setSelectedDate(selected);
    setIsDialogOpen(true);
  };

  const handleAddEvent = () => {
    if (newEventTitle && selectedDate) {
      const calendarApi = selectedDate.view.calendar;
      calendarApi.addEvent({
        id: `${selectedDate.dateStr}-${newEventTitle}`,
        title: newEventTitle,
        start: selectedDate.startStr,
        end: selectedDate.endStr,
        allDay: selectedDate.allDay,
      });
      setShowAlert(true);
      setAlertMessage("Event added successfully!");
      setTimeout(() => setShowAlert(false), 3000);
    }
    setIsDialogOpen(false);
    setNewEventTitle("");
    setSelectedDate(null);
  };

  const handleEventClick = (info) => {
    const event = info.event;
    const extendedProps = event.extendedProps;

    if (extendedProps && Object.keys(extendedProps).length > 0) {
      const details = `
Guest: ${event.title}
Check-in: ${formatDate(event.start, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
Check-out: ${formatDate(event.end, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
Status: ${extendedProps.status}
Platform: ${extendedProps.platform}
Contact: ${extendedProps.contactNumber}
Special Requests: ${extendedProps.specialRequests || "None"}
Early Check-in: ${extendedProps.earlyCheckIn ? "Yes" : "No"}
Late Check-out: ${extendedProps.lateCheckOut ? "Yes" : "No"}
Parking: ${extendedProps.parking ? `Yes (${extendedProps.plateNumber})` : "No"}
      `;
      alert(details);
    } else if (window.confirm(`Delete event '${event.title}'?`)) {
      event.remove();
      setShowAlert(true);
      setAlertMessage("Event deleted successfully!");
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const EventSidebar = ({ isDrawer = false }) => (
    <Box
      sx={{
        backgroundColor: colors.primary[400],
        p: 2,
        borderRadius: 1,
        height: isDrawer ? "auto" : "75vh",
        overflow: "auto",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold">
          Upcoming Bookings
        </Typography>
        {isDrawer && (
          <IconButton onClick={() => setIsDrawerOpen(false)}>
            <Close />
          </IconButton>
        )}
      </Box>
      {currentEvents.length === 0 ? (
        <Typography color="text.secondary">No bookings scheduled</Typography>
      ) : (
        <List>
          {currentEvents.map((event) => (
            <Tooltip
              key={event.id}
              title={
                event.extendedProps?.specialRequests || "No special requests"
              }
              placement="right"
            >
              <ListItem
                sx={{
                  backgroundColor:
                    event.backgroundColor || colors.greenAccent[500],
                  mb: 1,
                  borderRadius: 1,
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateX(4px)",
                  },
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2">
                        {formatDate(new Date(event.start), {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {event.extendedProps?.status || ""}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </Tooltip>
          ))}
        </List>
      )}
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Header title="Calendar" subtitle="Booking Calendar Overview" />

      {showAlert && (
        <Alert
          severity="success"
          sx={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
          }}
        >
          {alertMessage}
        </Alert>
      )}

      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={2}>
        {!isMobile && (
          <Box width={{ xs: "100%", md: "300px" }}>
            <EventSidebar />
          </Box>
        )}

        <Box flex="1">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: isMobile
                ? "listMonth,dayGridMonth"
                : "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView={isMobile ? "listMonth" : "dayGridMonth"}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            events={currentEvents}
          />
        </Box>
      </Box>

      {isMobile && (
        <IconButton
          onClick={() => setIsDrawerOpen(true)}
          sx={{
            position: "fixed",
            bottom: 80,
            right: 20,
            backgroundColor: colors.primary[400],
            color: colors.grey[100],
            "&:hover": { backgroundColor: colors.primary[500] },
            zIndex: 1000,
          }}
        >
          <Event />
        </IconButton>
      )}

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box sx={{ width: 300 }}>
          <EventSidebar isDrawer />
        </Box>
      </Drawer>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            fullWidth
            variant="outlined"
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddEvent} variant="contained" color="primary">
            Add Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;
