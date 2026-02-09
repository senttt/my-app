import { db } from "../backend/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// Fetch available honesty store items for a given unit
export const fetchAvailableItems = async (unitID) => {
  try {
    const querySnapshot = await getDocs(
      collection(db, `honestyStore/${unitID}`)
    );
    let items = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    return items;
  } catch (error) {
    console.error("Error fetching honesty store items:", error);
    return [];
  }
};

// Create a purchase entry in honestyStorePurchases
export const createPurchase = async (
  unitID,
  userID,
  bookingID,
  items,
  totalPrice
) => {
  try {
    const purchaseID = crypto.randomUUID();
    const purchaseRef = doc(db, "honestyStorePurchases", purchaseID);
    await setDoc(purchaseRef, {
      unitID,
      userID,
      bookingID,
      items,
      totalPrice,
      purchaseDate: new Date(),
    });
    return { success: true, purchaseID };
  } catch (error) {
    console.error("Error creating purchase:", error);
    return { success: false, error };
  }
};

// Edit a purchase entry
export const editPurchase = async (purchaseID, updatedData) => {
  try {
    const purchaseRef = doc(db, "honestyStorePurchases", purchaseID);
    await updateDoc(purchaseRef, updatedData);
    return { success: true };
  } catch (error) {
    console.error("Error editing purchase:", error);
    return { success: false, error };
  }
};

// Delete a purchase entry
export const deletePurchase = async (purchaseID) => {
  try {
    await deleteDoc(doc(db, "honestyStorePurchases", purchaseID));
    return { success: true };
  } catch (error) {
    console.error("Error deleting purchase:", error);
    return { success: false, error };
  }
};
