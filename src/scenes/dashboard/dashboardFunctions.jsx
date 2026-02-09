import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../../backend/firebase";

export async function fetchUnitsPerUser() {
  try {
    const user = auth.currentUser;
    if (!user) return [];
    const userId = user.uid;
    const unitsSnapshot = await getDocs(collection(db, "units"));
    const userUnits = unitsSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((unit) => unit.members?.includes(userId))
      .map((unit) => ({
        id: unit.id,
        name: unit.name || `Unit ${unit.id}`,
        settings: unit.settings || {},
      }));
    return userUnits;
  } catch (error) {
    console.error("Error fetching units:", error);
    return [];
  }
}

export async function fetchPaidBookingsByUnitAndMonth(unitId, month, year) {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const bookingsRef = collection(db, "bookings");
    const q = query(
      bookingsRef,
      where("unitId", "==", unitId),
      where("status", "==", "Paid"),
      where("checkIn", ">=", Timestamp.fromDate(startDate)),
      where("checkIn", "<=", Timestamp.fromDate(endDate))
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

export async function calculateMonthlyRevenue(unitId, month, year) {
  try {
    const bookings = await fetchPaidBookingsByUnitAndMonth(unitId, month, year);
    let totalRevenue = 0;
    let incompleteBookings = [];

    const unitDoc = await getDoc(doc(db, "units", unitId));
    const unitData = unitDoc?.data();
    const settings = unitData?.settings || {};

    for (const booking of bookings) {
      let bookingRevenue = 0;

      if (booking?.price == null && settings?.isStaticPricing) {
        const platformPricing = settings?.platforms?.find(
          (p) => p?.name === booking?.platform
        )?.pricing;

        if (platformPricing) {
          bookingRevenue = Number(platformPricing);
        } else {
          incompleteBookings.push(booking.id);
          continue;
        }
      } else {
        bookingRevenue = Number(booking.price || 0);
      }

      const honestyPurchases = await fetchHonestyStorePurchasesByBooking(
        booking.id
      );
      const honestyRevenue = honestyPurchases.reduce(
        (sum, purchase) =>
          sum + Number(purchase?.amount || 0) * Number(purchase?.quantity || 0),
        0
      );

      totalRevenue += bookingRevenue + honestyRevenue;
    }

    return { totalRevenue, incompleteBookings };
  } catch (error) {
    console.error("Error calculating monthly revenue:", error);
    return { totalRevenue: 0, incompleteBookings: [] };
  }
}

export async function calculateMonthlyExpenses(unitId, month, year) {
  try {
    const unitDoc = await getDoc(doc(db, "units", unitId));
    const unitData = unitDoc?.data();
    const settings = unitData?.settings || {};

    const monthlyExpenses = settings?.monthlyExpenses || [];
    const fixedExpenses = monthlyExpenses.reduce(
      (sum, expense) => sum + Number(expense?.amount || 0),
      0
    );

    const bookings = await fetchPaidBookingsByUnitAndMonth(unitId, month, year);
    let perUseTotal = 0;

    for (const booking of bookings) {
      if (settings?.perUseExpenses) {
        perUseTotal += settings.perUseExpenses.reduce(
          (sum, expense) => sum + Number(expense?.amount || 0),
          0
        );
      }

      if (booking?.parking && settings?.parkingType === "perUse") {
        perUseTotal += Number(settings?.perUseParkingFee || 0);
      }

      const honestyPurchases = await fetchHonestyStorePurchasesByBooking(
        booking.id
      );
      for (const purchase of honestyPurchases) {
        const honestyExpense = settings?.honestyExpenses?.find(
          (e) => e.name === purchase.item
        );
        if (honestyExpense) {
          perUseTotal +=
            Number(honestyExpense.amount) * Number(purchase.quantity);
        }
      }
    }

    return {
      fixed: fixedExpenses,
      perUse: perUseTotal,
      total: fixedExpenses + perUseTotal,
    };
  } catch (error) {
    console.error("Error calculating monthly expenses:", error);
    return { fixed: 0, perUse: 0, total: 0 };
  }
}
