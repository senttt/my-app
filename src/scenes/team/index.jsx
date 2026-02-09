import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db, auth } from "../../backend/firebase";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);

  const getAccessIcon = (access) => {
    if (access === "admin") {
      return (
        <AdminPanelSettingsOutlinedIcon sx={{ color: colors.grey[100] }} />
      );
    }
    return <LockOpenOutlinedIcon sx={{ color: colors.grey[100] }} />;
  };

  // Fetch units from Firestore
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          const unitsSnapshot = await getDocs(collection(db, "units"));
          const userUnits = [];

          unitsSnapshot.forEach((doc) => {
            const unitData = doc.data();
            if (unitData.members.includes(userId)) {
              userUnits.push({ id: doc.id, ...unitData });
            }
          });

          setUnits(userUnits);
          if (userUnits.length > 0) setSelectedUnit(userUnits[0].id);
        }
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };

    fetchUnits();
  }, []);

  // Fetch team members for the selected unit
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!selectedUnit) return;

      try {
        const unitDoc = await getDoc(doc(db, "units", selectedUnit));
        if (unitDoc.exists()) {
          const unitData = unitDoc.data();
          const members = unitData.members.map((memberId) => ({
            id: memberId,
            name:
              unitData.memberDetails[memberId]?.displayName || "Unknown User",
            email:
              unitData.memberDetails[memberId]?.email || "No email provided",
            access: memberId === unitData.adminId ? "admin" : "member",
          }));
          setTeamMembers(members);
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    fetchTeamMembers();
  }, [selectedUnit]);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 120,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "access",
      headerName: "Access Level",
      flex: 1,
      minWidth: 110,
      renderCell: ({ row: { access } }) => (
        <Box
          sx={{
            width: "100%",
            m: "0 auto",
            p: "5px",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            borderRadius: "4px",
            backgroundColor:
              access === "admin"
                ? colors.greenAccent[600]
                : colors.greenAccent[700],
          }}
        >
          {getAccessIcon(access)}
          <Typography
            color={colors.grey[100]}
            sx={{
              ml: "5px",
              textTransform: "capitalize",
            }}
          >
            {access}
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Header title="TEAM" subtitle="Managing the Team Members" />

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="unit-select-label">Select Unit</InputLabel>
        <Select
          labelId="unit-select-label"
          id="unit-select"
          value={selectedUnit}
          label="Select Unit"
          onChange={(e) => setSelectedUnit(e.target.value)}
        >
          {units.map((unit) => (
            <MenuItem key={unit.id} value={unit.id}>
              {unit.name || unit.id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box
        sx={{
          height: { xs: "calc(100vh - 200px)", sm: "75vh" },
          "& .MuiDataGrid-root": {
            border: "none",
            fontSize: { xs: "0.875rem", sm: "1rem" },
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={teamMembers}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          checkboxSelection
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: { pageSize: isMobile ? 10 : 25 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          density={isMobile ? "compact" : "standard"}
        />
      </Box>
    </Box>
  );
};

export default Team;
