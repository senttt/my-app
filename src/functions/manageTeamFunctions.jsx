import { db } from "../backend/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
} from "firebase/firestore";

// Fetch all units associated with the user
export const fetchAssociatedUnits = async (userID) => {
  const unitsRef = collection(db, "units");
  const querySnapshot = await getDocs(unitsRef);
  let units = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.members && data.members[userID]) {
      units.push({ id: doc.id, ...data });
    }
  });

  return units;
};

// Fetch unit members
export const fetchUnitMembers = async (unitID) => {
  const unitRef = doc(db, "units", unitID);
  const unitSnap = await getDoc(unitRef);

  if (unitSnap.exists()) {
    return unitSnap.data().members || {};
  }
  return {};
};

// Change user access to moderator
export const makeModeratorMemberAccess = async (unitID, userID) => {
  const unitRef = doc(db, "units", unitID);
  const unitSnap = await getDoc(unitRef);

  if (unitSnap.exists()) {
    let members = unitSnap.data().members;
    if (members[userID]) {
      members[userID].access = "moderator";
      await updateDoc(unitRef, { members });
    }
  }
};

// Change user access to regular user
export const makeUserMemberAccess = async (unitID, userID) => {
  const unitRef = doc(db, "units", unitID);
  const unitSnap = await getDoc(unitRef);

  if (unitSnap.exists()) {
    let members = unitSnap.data().members;
    if (members[userID]) {
      members[userID].access = "user";
      await updateDoc(unitRef, { members });
    }
  }
};

// Remove a member from the unit
export const removeMember = async (unitID, userID) => {
  const unitRef = doc(db, "units", unitID);
  const unitSnap = await getDoc(unitRef);

  if (unitSnap.exists()) {
    let members = unitSnap.data().members;
    if (members[userID]) {
      delete members[userID];
      await updateDoc(unitRef, { members });
    }
  }
};

// Fetch invite code for a unit
export const fetchInviteCode = async (unitID) => {
  const unitRef = doc(db, "units", unitID);
  const unitSnap = await getDoc(unitRef);

  if (unitSnap.exists()) {
    return unitSnap.data().inviteCode || "";
  }
  return "";
};

// Generate a new invite code
export const generateNewInviteCode = async (unitID) => {
  const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  const unitRef = doc(db, "units", unitID);
  await updateDoc(unitRef, { inviteCode: newCode });
  return newCode;
};

// Create a new unit
export const createUnit = async (data, adminID) => {
  const unitRef = doc(collection(db, "units"));

  const unitData = {
    adminID,
    monthlyExpenses: data.monthlyExpenses || 0,
    platforms: data.platforms || [],
    parkingFee: data.parkingFee || 0,
    inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    checkInTime: data.checkInTime || "14:00",
    checkOutTime: data.checkOutTime || "12:00",
    earlyCheckInFee: data.earlyCheckInFee || 0,
    lateCheckOutFee: data.lateCheckOutFee || 0,
    members: {
      [adminID]: { name: data.adminName || "Admin", access: "admin" },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDoc(unitRef, unitData);
  return unitRef.id;
};
