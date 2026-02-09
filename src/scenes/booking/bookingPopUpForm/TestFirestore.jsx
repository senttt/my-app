import React from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../backend/firebase"; // Ensure correct import path

const TestFirestore = () => {
  const handleAddBooking = async () => {
    const testBooking = {
      name: "John Doe",
      platform: "Agoda",
      checkIn: "01/01/2025",
      checkOut: "01/05/2025",
      parking: true,
      earlyCheckIn: false,
      lateCheckOut: true,
      status: "Paid",
      loggedBy: "Admin",
    };

    try {
      const docRef = await addDoc(collection(db, "bookings"), testBooking);
      console.log("Document written with ID: ", docRef.id);
      alert("Test booking successfully added!");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error adding booking: " + error.message);
    }
  };

  return (
    <div>
      <button onClick={handleAddBooking}>Add Test Booking</button>
    </div>
  );
};

export default TestFirestore;
