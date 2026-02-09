import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import LineChart from "../../components/LineChart";
import PieChart from "../../components/PieChart";
import BarChart from "../../components/BarChart";
import {
  PersonOutlined,
  PointOfSaleOutlined,
  TimelineOutlined,
  ReceiptOutlined,
} from "@mui/icons-material";
import {
  fetchUnitsPerUser,
  calculateMonthlyRevenue,
  calculateMonthlyExpenses,
} from "./dashboardFunctions";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [units, setUnits] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dashboardData, setDashboardData] = useState({
    revenue: 0,
    expenses: { total: 0 },
    incompleteBookings: [],
  });

  useEffect(() => {
    const loadUnits = async () => {
      const userUnits = await fetchUnitsPerUser();
      setUnits(userUnits);
      if (userUnits.length > 0) {
        setSelectedUnit(userUnits[0].id);
      }
    };
    loadUnits();
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!selectedUnit) return;
      try {
        const [{ totalRevenue, incompleteBookings }, expenses] =
          await Promise.all([
            calculateMonthlyRevenue(selectedUnit, selectedMonth, selectedYear),
            calculateMonthlyExpenses(selectedUnit, selectedMonth, selectedYear),
          ]);
        setDashboardData({
          revenue: totalRevenue,
          expenses,
          incompleteBookings,
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };
    loadDashboardData();
  }, [selectedUnit, selectedMonth, selectedYear]);

  return (
    <Box m="20px">
      <Header
        title="DASHBOARD"
        subtitle="Overview of your rental performance"
      />
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Unit</InputLabel>
            <Select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
            >
              {units.map((unit) => (
                <MenuItem key={unit.id} value={unit.id}>
                  {unit.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {dashboardData.incompleteBookings.length > 0 && (
        <Alert severity="warning" mt={2}>
          {dashboardData.incompleteBookings.length} booking(s) missing price
          data.
        </Alert>
      )}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={4}>
          <StatBox
            title={`₱${dashboardData.revenue}`}
            subtitle="Monthly Revenue"
            icon={<PointOfSaleOutlined />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatBox
            title={`₱${dashboardData.expenses.total}`}
            subtitle="Monthly Expenses"
            icon={<ReceiptOutlined />}
          />
        </Grid>
      </Grid>
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box height="250px">
              <Typography variant="h5">Revenue vs Expenses</Typography>
              <LineChart
                data={[
                  { name: "Revenue", value: dashboardData.revenue },
                  { name: "Expenses", value: dashboardData.expenses.total },
                ]}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box height="250px">
              <Typography variant="h5">Expense Breakdown</Typography>
              <PieChart
                data={[
                  {
                    id: "Fixed",
                    label: "Fixed",
                    value: dashboardData.expenses.total,
                  },
                ]}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
