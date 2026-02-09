import { db } from "../backend/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// Fetch all associated units of the user
export const fetchAssociatedUnits = async (userID) => {
  try {
    const unitsRef = collection(db, "units");
    const q = query(unitsRef, where(`members.${userID}`, "!=", null));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching units:", error);
    return [];
  }
};

// Fetch recent bookings for the selected unit
export const fetchRecentBookings = async (unitID, month) => {
  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("unitID", "==", unitID));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

// Fetch total revenue of the month from bookings
export const fetchTotalRevenueMonthBooking = async (unitID, month) => {
  try {
    const bookings = await fetchRecentBookings(unitID, month);
    return bookings.reduce((total, booking) => total + (booking.price || 0), 0);
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    return 0;
  }
};

// Fetch total revenue of the month from honesty store
export const fetchTotalRevenueMonthHonestyStore = async (unitID, month) => {
  try {
    const purchasesRef = collection(db, "honestyStorePurchases");
    const q = query(purchasesRef, where("unitID", "==", unitID));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.reduce(
      (total, doc) => total + doc.data().totalPrice,
      0
    );
  } catch (error) {
    console.error("Error fetching honesty store revenue:", error);
    return 0;
  }
};

// Fetch total revenue from parking, early check-in, and late check-out fees
export const fetchTotalRevenueMonthFees = async (unitID, month) => {
  try {
    const bookings = await fetchRecentBookings(unitID, month);
    return bookings.reduce((total, booking) => {
      return (
        total +
        (booking.isEarlyCheckIn ? booking.earlyCheckInFee || 0 : 0) +
        (booking.isLateCheckOut ? booking.lateCheckOutFee || 0 : 0) +
        (booking.isParking ? booking.parkingFee || 0 : 0)
      );
    }, 0);
  } catch (error) {
    console.error("Error calculating fees:", error);
    return 0;
  }
};

// Get total days occupied/booked in the month
export const fetchTotalMonthOccupancyBooking = async (unitID, month) => {
  try {
    const bookings = await fetchRecentBookings(unitID, month);
    return bookings.length;
  } catch (error) {
    console.error("Error calculating occupancy:", error);
    return 0;
  }
};

// Fetch recent expenses for the selected unit
export const fetchRecentExpenses = async (unitID, month) => {
  try {
    const expensesRef = collection(db, "expenses");
    const q = query(expensesRef, where("unitID", "==", unitID));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }
};

// Fetch total expenses including default and custom monthly expenses
export const fetchTotalExpensesMonth = async (unitID, month) => {
  try {
    const expenses = await fetchRecentExpenses(unitID, month);
    return expenses.reduce((total, expense) => total + expense.price, 0);
  } catch (error) {
    console.error("Error calculating total expenses:", error);
    return 0;
  }
};
