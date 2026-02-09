import React, { useEffect, useState } from "react";
import {
  fetchTotalRevenueMonthBooking,
  fetchTotalRevenueMonthHonestyStore,
  fetchTotalRevenueMonthFees,
} from "../backend/dashboardFunctions";
import { fetchTotalExpensesMonth } from "../backend/expensesFunctions";
import {
  fetchAssociatedBookings,
  createBookingUser,
  editBooking,
  deleteBooking,
} from "../backend/bookingFunctions";
import {
  fetchAssociatedExpenses,
  createExpense,
  editExpense,
  removeExpense,
} from "../backend/expensesFunctions";
import {
  fetchAvailableItems,
  createPurchase,
  editPurchase,
  deletePurchase,
} from "../backend/honestyStoreFunctions";
import {
  fetchUnitMembers,
  makeModeratorMemberAccess,
  makeUserMemberAccess,
  removeMember,
} from "../backend/manageTeamFunctions";

const DashboardComponent = ({ unitID, month }) => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [honestyStorePurchases, setHonestyStorePurchases] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const revenueFromBookings = await fetchTotalRevenueMonthBooking(
          unitID,
          month
        );
        const revenueFromHonestyStore =
          await fetchTotalRevenueMonthHonestyStore(unitID, month);
        const revenueFromFees = await fetchTotalRevenueMonthFees(unitID, month);
        const totalExpensesData = await fetchTotalExpensesMonth(unitID, month);

        setTotalRevenue(
          revenueFromBookings + revenueFromHonestyStore + revenueFromFees
        );
        setTotalExpenses(totalExpensesData);
        setTotalProfit(totalRevenue - totalExpenses);

        setBookings(
          await fetchAssociatedBookings(unitID, "2024-01-01", "2024-12-31")
        );
        setExpenses(
          await fetchAssociatedExpenses(unitID, "2024-01-01", "2024-12-31")
        );
        setHonestyStorePurchases(await fetchAvailableItems(unitID));
        setTeamMembers(await fetchUnitMembers(unitID));
        setLogs(await fetchLogs(unitID));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [unitID, month]);

  return (
    <div>
      <h2>Dashboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h3>Summary</h3>
          <ul>
            <li>
              <strong>Total Revenue:</strong> ${totalRevenue.toFixed(2)}
            </li>
            <li>
              <strong>Total Expenses:</strong> ${totalExpenses.toFixed(2)}
            </li>
            <li>
              <strong>Total Profit:</strong> ${totalProfit.toFixed(2)}
            </li>
          </ul>

          <h3>Bookings</h3>
          <ul>
            {bookings.map((b) => (
              <li key={b.id}>
                {b.platform} - ${b.price} - {b.status} ({b.paymentStatus})
              </li>
            ))}
          </ul>

          <h3>Expenses</h3>
          <ul>
            {expenses.map((e) => (
              <li key={e.id}>
                {e.name} ({e.category}) - ${e.price} - {e.expenseDate}
              </li>
            ))}
          </ul>

          <h3>Honesty Store Purchases</h3>
          <ul>
            {honestyStorePurchases.map((p) => (
              <li key={p.id}>
                ${p.totalPrice} - {p.purchaseDate}
              </li>
            ))}
          </ul>

          <h3>Team Members</h3>
          <ul>
            {teamMembers.map((m) => (
              <li key={m.id}>
                {m.name} - {m.access}
              </li>
            ))}
          </ul>

          <h3>Activity Logs</h3>
          <ul>
            {logs.map((l) => (
              <li key={l.id}>
                {l.logType} - {l.username} ({l.date})
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default DashboardComponent;
