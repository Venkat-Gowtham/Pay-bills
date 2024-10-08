import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TableSortLabel,
  TextField,
  MenuItem,
  useMediaQuery,
  Drawer,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import style from "./home.module.css";
import PopupCard from "../popup_card/popupCard.js";
import ModalForm from "../forms/MainForm.js";
import { DataContext } from "../../context/dataprovider.js";
import Loader from "../../loader/loader.js";
import { useNavigate } from "react-router-dom";

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("projectId");
  const [senderNameFilter, setSenderNameFilter] = useState("");
  const [receiverIdFilter, setReceiverIdFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const clientId = localStorage.getItem("clientId");
  const navigate = useNavigate();

  const { userData, statusDef, statusColors } = useContext(DataContext);

  // Define dropdown options
  const statusOptions = [
    { label: "All", value: "" },
    { label: "Submitted", value: statusDef.initial },
    { label: "Approved", value: statusDef.phase1 },
    { label: "Uploaded to Bank", value: statusDef.phase2 },
    { label: "Waiting For Bills", value: statusDef.phase3 },
    { label: "Quality Hold", value: statusDef.phase4 },
    { label: "Bills Accepted", value: statusDef.final },
    { label: "Denied", value: statusDef.fail },
    { label: "Bills Quality Failed", value: statusDef.qualityfail },
    { label: "Suspended", value: statusDef.Suspend },
  ];

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleClearFilters = () => {
    setSenderNameFilter("");
    setReceiverIdFilter("");
    setStatusFilter("");
    setDateFilter("");
  };

  useEffect(() => {
    if (!clientId) {
      navigate("/");
    } else {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:8080/api/transactions/getClientData/${clientId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setData(response.data.data);
        } catch (error) {
          console.log("Error fetching data:", error);
        }
      };
      setLoading(true);
      fetchData();
      setLoading(false);
    }
  }, [clientId, navigate]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toISOString().split("T")[0]; // Fix to ISO date format (yyyy-mm-dd)
  };

  const sortedData = [...data]
    .filter(
      (row) =>
        row.senderName.includes(senderNameFilter) &&
        row.receiverId.includes(receiverIdFilter) &&
        (!statusFilter || row.status === statusFilter) &&
        (!dateFilter || formatDate(row.timestamp) === dateFilter) // Fix date filter logic
    )
    .sort((a, b) => {
      if (a[orderBy] < b[orderBy]) {
        return order === "asc" ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });

  const getStatusColor = (currentStatus) => {
    switch (currentStatus) {
      case statusDef.initial:
        return statusColors.initial;
      case statusDef.phase1:
        return statusColors.phase1;
      case statusDef.phase2:
        return statusColors.phase2;
      case statusDef.phase3:
        return statusColors.phase3;
      case statusDef.phase4:
        return statusColors.phase4;
      case statusDef.final:
        return statusColors.final;
      default:
        return "#D32F2F";
    }
  };

  const handleViewClick = (rowData) => {
    setSelectedData(rowData);
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setSelectedData(null);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#007bff",
      },
      secondary: {
        main: "#6c757d",
      },
    },
    typography: {
      button: {
        textTransform: "none",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className={style.header}>
            <div className={style.buttonGroup}>
              <Button variant="contained" className={style.button}>
                Work Flow
              </Button>
              <Button variant="contained" className={style.button}>
                Status
              </Button>
              <Button
                variant="contained"
                className={style.button}
                onClick={handleOpenModal}
              >
                Payment Request
              </Button>
            </div>
            {isMobile ? (
              <Button variant="outlined" onClick={() => setSidebarOpen(true)}>
                Open Filters
              </Button>
            ) : (
              <div className={style.filters}>
                <TextField
                  label="Sender Name"
                  value={senderNameFilter}
                  onChange={(e) => setSenderNameFilter(e.target.value)}
                  variant="outlined"
                  size="small"
                  className={style.filter}
                />
                <TextField
                  label="Receiver ID"
                  value={receiverIdFilter}
                  onChange={(e) => setReceiverIdFilter(e.target.value)}
                  variant="outlined"
                  size="small"
                  className={style.filter}
                />
                <TextField
                  label="Status"
                  select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  variant="outlined"
                  size="small"
                  className={style.filter}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  variant="outlined"
                  size="small"
                  className={style.filter}
                />
                <Button variant="outlined" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          <Drawer
            anchor="right"
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          >
            <div className={style.sidebar}>
              <div className={style.sidebarContent}>
                <h2>Filters</h2>
                <TextField
                  label="Sender Name"
                  value={senderNameFilter}
                  onChange={(e) => setSenderNameFilter(e.target.value)}
                  variant="outlined"
                  size="small"
                  className={style.filter}
                />
                <TextField
                  label="Receiver ID"
                  value={receiverIdFilter}
                  onChange={(e) => setReceiverIdFilter(e.target.value)}
                  variant="outlined"
                  size="small"
                  className={style.filter}
                />
                <TextField
                  label="Status"
                  select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  variant="outlined"
                  size="small"
                  className={style.filter}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  variant="outlined"
                  size="small"
                  className={style.filter}
                />
                <Button variant="outlined" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          </Drawer>

          <TableContainer component={Paper} className={style.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "projectId"}
                      direction={order}
                      onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                    >
                      Project ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Sender Name</TableCell>
                  <TableCell>Receiver ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((row) => (
                  <TableRow key={row.projectId}>
                    <TableCell>{row.projectId}</TableCell>
                    <TableCell>{row.senderName}</TableCell>
                    <TableCell>{row.receiverId}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        style={{
                          backgroundColor: getStatusColor(row.status),
                          color: "white",
                        }}
                      />
                    </TableCell>
                    <TableCell>{formatDate(row.timestamp)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewClick(row)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <PopupCard
            open={openPopup}
            onClose={handleClosePopup}
            data={selectedData} // Send the raw data
            userData={userData}
          />
          <ModalForm open={openModal} handleClose={handleCloseModal} />
        </>
      )}
    </ThemeProvider>
  );
}

export default Home;
