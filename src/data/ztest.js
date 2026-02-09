import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  ArrowDownward,
  Home,
  AttachMoney,
  People,
  TrendingUp,
} from "@mui/icons-material";
import { fetchUnitsPerUser } from "./dashboardFunctions";

const StatBox = ({ title, subtitle, increase, icon }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
      }}
    >
      <Box>
        <Typography variant="h4" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
        <Typography variant="caption" color="success.main">
          {increase}
        </Typography>
      </Box>
      {icon}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({ unitId: "" });
  const [errors, setErrors] = useState({ unitId: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userUnits = await fetchUnitsPerUser();
        setUnits(userUnits);
        if (userUnits.length > 0) {
          setFormData((prev) => ({ ...prev, unitId: userUnits[0].id }));
        }
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const mockTransactions = [
    { txId: "01e4dsa", user: "John Smith", date: "2024-02-01", cost: "432.95" },
    { txId: "02e4dsa", user: "Jane Doe", date: "2024-02-02", cost: "325.50" },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.unitId}>
            <InputLabel id="unit-select-label">Select Unit</InputLabel>
            <Select
              labelId="unit-select-label"
              value={formData.unitId}
              label="Select Unit"
              onChange={(e) => handleInputChange("unitId", e.target.value)}
              required
            >
              {units.map((unit) => (
                <MenuItem key={unit.id} value={unit.id}>
                  {unit.name}
                </MenuItem>
              ))}
            </Select>
            {errors.unitId && (
              <Box
                sx={{
                  color: "error.main",
                  fontSize: "0.75rem",
                  mt: 0.5,
                  ml: 1.5,
                }}
              >
                {errors.unitId}
              </Box>
            )}
          </FormControl>
        </Grid>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            AIRBNB FINANCE DASHBOARD
          </Typography>
          <Typography color="text.secondary">
            Track your short-term rental earnings
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<ArrowDownward />}
          fullWidth
          sx={{ width: { xs: "100%", md: "auto" } }}
        >
          Download Report
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <StatBox
          title="P12,361"
          subtitle="Total Earnings"
          increase="+14%"
          icon={<AttachMoney color="success" sx={{ fontSize: 30 }} />}
        />
        <StatBox
          title="45"
          subtitle="Total Bookings"
          increase="+21%"
          icon={<Home color="success" sx={{ fontSize: 30 }} />}
        />
        <StatBox
          title="32"
          subtitle="New Guests"
          increase="+5%"
          icon={<People color="success" sx={{ fontSize: 30 }} />}
        />
        <StatBox
          title="85%"
          subtitle="Occupancy Rate"
          increase="+7%"
          icon={<TrendingUp color="success" sx={{ fontSize: 30 }} />}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
          gap: 2,
        }}
      >
        <Card>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h6">Revenue Overview</Typography>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  $59,342.32
                </Typography>
              </Box>
              <ArrowDownward color="success" />
            </Box>
            <Box sx={{ height: 250 }}>
              {/* LineChart component would go here */}
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Transactions
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {mockTransactions.map((transaction) => (
                <Box
                  key={transaction.txId}
                  sx={{
                    p: 2,
                    borderBottom: 1,
                    borderColor: "divider",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography color="success.main" fontWeight="bold">
                      {transaction.txId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {transaction.user}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body2">{transaction.date}</Typography>
                    <Typography
                      sx={{
                        bgcolor: "success.main",
                        color: "white",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        display: "inline-block",
                      }}
                    >
                      {"$" + transaction.cost}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
