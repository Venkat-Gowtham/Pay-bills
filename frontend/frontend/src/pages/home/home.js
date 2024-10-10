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
  Drawer,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import axios from "axios";
import style from "./home.module.css";
import PopupCard from "../popup_card/popupCard.js";
import ModalForm from "../forms/MainForm.js";
import { DataContext } from "../../context/dataprovider.js";
import Loader from "../../loader/loader.js";
import { useNavigate } from "react-router-dom";
const AUTH_API = process.env.REACT_APP_AUTH_API;
const AUTH_USER = process.env.REACT_APP_AUTH_USER;
const NOTIFY_USER = process.env.REACT_APP_NOTIFY_USER;
const TRANSACTIONS_API = process.env.REACT_APP_TRANSACTIONS_API;
const IMAGE_UPLOAD = process.env.REACT_APP_IMAGE_UPLOAD;
const UPDATE_STATUS = process.env.REACT_APP_UPDATE_STATUS;
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
  const [editData, setEditData] = useState(null); // State to hold data for editing
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

  const handleClearFilters = () => {
    setSenderNameFilter("");
    setReceiverIdFilter("");
    setStatusFilter("");
    setDateFilter("");
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${TRANSACTIONS_API}/getClientData/${clientId}`,
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
  const handleOpenModal = (rowData) => {
    if (!rowData || rowData.nativeEvent) {
      rowData = {};  // Set it to an empty object if it's an event
    }
    console.log("Row Data:", rowData);
    // Clone the original rowData to avoid mutations
    const token = localStorage.getItem("token");
    let updatedRowData = { ...rowData };
    console.log("Updated Row Data:", updatedRowData);
    // Check if rowData has an id
    if (rowData?.id) {
      console.log(rowData.id);
    }

    const bankPromise = rowData?.BankId
      ? axios.get(`${TRANSACTIONS_API}/getBankData/${rowData.BankId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(response => {
          console.log("Bank Data Received", response.data);
          const bankData = response.data;
          console.log("Bank Data:", bankData);
          // Append bank data fields to updatedRowData
          updatedRowData = {
            ...updatedRowData,
            ifsc: bankData.ifsc || updatedRowData.ifsc,
            accountNumber: bankData.accountNumber || updatedRowData.accountNumber,
            ponumber: bankData.ponumber || updatedRowData.ponumber,
            vendorname: bankData.vendorname || updatedRowData.vendorname,
          };
          console.log("Updated Row Data after adding bank details:", updatedRowData);
        })
        .catch(error => {
          console.error("Error fetching bank data:", error);
        })
      : Promise.resolve();

    const devPromise = rowData?.development
      ? axios.get(`${TRANSACTIONS_API}/getDevData/${rowData.development}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(response => {
          console.log("Development Data Received", response.data);
          const devData = response.data;
          console.log("Development Data:", devData);
          // Append development data fields to updatedRowData
          updatedRowData = {
            ...updatedRowData,
            payfor: devData.payfor || updatedRowData.payfor,
            // Include any additional fields from devData as needed
          };
          console.log("Updated Row Data after adding development details:", updatedRowData);
        })
        .catch(error => {
          console.error("Error fetching development data:", error);
        })
      : Promise.resolve();

    // Wait for both (or either) API call(s) to finish before updating rowData and opening the modal
    Promise.all([bankPromise, devPromise]).then(() => {
      setEditData(updatedRowData);
      // console.log("Edit Data:", );
      setOpenModal(true);
    });
  };
  const handleCloseModal = () => {
    fetchData();
    setOpenModal(false);
  };
  useEffect(() => {
    if (!clientId) {
      navigate("/");
    } else {
      setLoading(true);
      fetchData();
      setLoading(false);
    }
  }, [clientId, navigate]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toISOString().split("T")[0];
  };

  const sortedData = [...data]
    .filter(
      (row) =>
        row.senderName.includes(senderNameFilter) &&
        row.receiverId.includes(receiverIdFilter) &&
        (!statusFilter || row.status === statusFilter) &&
        (!dateFilter || formatDate(row.timestamp) === dateFilter)
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
  const handleUpdateRow = async (updatedRow) => {
    console.log("Updated Data:", updatedRow);

    // Ensure both IDs are correct
    setData((prevData) =>
      prevData.map((row) => {
        console.log("Row ID:", row.id, "Updated Row ID:", updatedRow.id);
        return row.id === updatedRow.id ? updatedRow : row;
      })
    );
    handleCloseModal(); // Close the modal after updating
  };
  const handleClosePopup = () => {
    fetchData();
    setOpenPopup(false);
    setSelectedData(null);
  };

  // download xl file
  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${TRANSACTIONS_API}/download`,
        {
          headers: {
            Authorization: ` Bearer ${token}`,
          },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.xlsx"); // Ensure .xlsx extension
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert("Unauthorized,Can't be Downloaded");
    }
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
              <Button
                onClick={() => fetchData()}
                variant="contained"
                className={style.button}
              >
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
            <div className={style.buttonGroupMobile}>
              <Button
                variant="contained"
                className={style.button}
                onClick={handleDownload}
              >
                Download BankDetails
              </Button>
              <IconButton
                className={style.filterIcon}
                onClick={() => setSidebarOpen(true)}
              >
                <FilterListIcon />
              </IconButton>
            </div>
          </div>

          <Drawer
            anchor="right"
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          >
            <div className={style.sidebar}>
              <div className={style.sidebarContent}>
                <h2>Filters</h2>
                <div className={style.filterItem}>
                  <span className={style.filterLabel}>Sender Name:</span>
                  <TextField
                    value={senderNameFilter}
                    onChange={(e) => setSenderNameFilter(e.target.value)}
                    variant="outlined"
                    size="small"
                    className={style.filterInput}
                  />
                </div>
                <div className={style.filterItem}>
                  <span className={style.filterLabel}>Receiver ID:</span>
                  <TextField
                    value={receiverIdFilter}
                    onChange={(e) => setReceiverIdFilter(e.target.value)}
                    variant="outlined"
                    size="small"
                    className={style.filterInput}
                  />
                </div>
                <div className={style.filterItem}>
                  <span className={style.filterLabel}>Status:</span>
                  <TextField
                    select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    variant="outlined"
                    size="small"
                    label="Select Status"
                    className={style.filterInput}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className={style.filterItem}>
                  <span className={style.filterLabel}>Date:</span>
                  <TextField
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    variant="outlined"
                    size="small"
                    className={style.filterInput}
                  />
                </div>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  className={style.clearButton}
                >
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
                {sortedData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.projectId}</TableCell>
                    <TableCell>{row.senderName}</TableCell>
                    <TableCell>{row.receiverId}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        style={{
                          backgroundColor: getStatusColor(row.status),
                          color: "#fff",
                        }}
                      />
                    </TableCell>
                    <TableCell>{formatDate(row.timestamp)}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleViewClick(row)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => {
                          if (row.status === "Submitted" && row.senderId === clientId) {
                            handleOpenModal(row);
                          } else {
                            alert("You can't edit this row");
                          }
                        }}
                        style={{ color: row.status === "Submitted" && row.senderId === clientId ? "red" : "grey" }}
                      >
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
          <ModalForm open={openModal} handleClose={handleCloseModal} editData={editData} handleUpdateRow={handleUpdateRow} />
        </>
      )}
    </ThemeProvider>
  );
}

export default Home;