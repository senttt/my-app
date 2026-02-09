import { db } from "../backend/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// Fetch user-associated expenses within a date range
export const fetchAssociatedExpenses = async (userID, rangeMin, rangeMax) => {
  try {
    const expensesRef = collection(db, "expenses");
    const q = query(
      expensesRef,
      where("userID", "==", userID),
      where("expenseDate", ">=", rangeMin),
      where("expenseDate", "<=", rangeMax)
    );
    const querySnapshot = await getDocs(q);
    let expenses = [];
    querySnapshot.forEach((doc) => {
      expenses.push({ id: doc.id, ...doc.data() });
    });
    return expenses;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }
};

// Create an expense entry
export const createExpense = async (unitID, userID, data) => {
  try {
    const expensesRef = collection(db, "expenses");
    const newExpense = { unitID, userID, ...data, createdAt: new Date() };
    const docRef = await addDoc(expensesRef, newExpense);
    return docRef.id;
  } catch (error) {
    console.error("Error creating expense:", error);
    return null;
  }
};

// Edit an expense entry
export const editExpense = async (expenseID, userID, data) => {
  try {
    const expenseRef = doc(db, "expenses", expenseID);
    await updateDoc(expenseRef, { ...data, updatedAt: new Date() });
    return true;
  } catch (error) {
    console.error("Error updating expense:", error);
    return false;
  }
};

// Remove an expense entry
export const removeExpense = async (expenseID, userID) => {
  try {
    const expenseRef = doc(db, "expenses", expenseID);
    await deleteDoc(expenseRef);
    return true;
  } catch (error) {
    console.error("Error deleting expense:", error);
    return false;
  }
};
