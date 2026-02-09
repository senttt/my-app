import { db } from "../backend/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

// Fetch all bookings associated with a user within a date range
export const fetchAssociatedBookings = async (userID, rangeMin, rangeMax) => {
  const bookingsRef = collection(db, "bookings");
  const q = query(bookingsRef, where("userID", "==", userID));
  const querySnapshot = await getDocs(q);

  let bookings = [];
  querySnapshot.forEach((doc) => {
    const booking = doc.data();
    if (booking.checkInDate >= rangeMin && booking.checkOutDate <= rangeMax) {
      bookings.push({ id: doc.id, ...booking });
    }
  });
  return bookings;
};

// Create a new booking for a user
export const createBookingUser = async (data, userID) => {
  const newBooking = { ...data, userID, createdAt: new Date() };
  const docRef = await addDoc(collection(db, "bookings"), newBooking);
  return docRef.id;
};

// Add customer details to an existing booking
export const addBookingDetailsCustomer = async (data, bookingID) => {
  const bookingRef = doc(db, "bookings", bookingID);
  await updateDoc(bookingRef, data);
};

// Edit an existing booking
export const editBooking = async (bookingID, updatedData) => {
  const bookingRef = doc(db, "bookings", bookingID);
  await updateDoc(bookingRef, updatedData);
};

// Delete a booking
export const deleteBooking = async (bookingID) => {
  const bookingRef = doc(db, "bookings", bookingID);
  await deleteDoc(bookingRef);
};
