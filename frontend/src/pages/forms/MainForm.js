import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import General from "./General";
import PaymentRequest from "./MaterialandPOPayment";
import PaymentDetailForm from "./SiteExpenditures";

function MainForm({ open, handleClose }) {
  const [selectedForm, setSelectedForm] = useState("SiteExpenditure");

  // Use the theme to set breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Media query for mobile view

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isMobile ? "90%" : 600, // Set width to 90% on mobile, 600px on larger screens
    maxHeight: "80vh",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: isMobile ? 2 : 4, // Padding adjustments for mobile
    overflowY: "auto",
    scrollbarWidth: "none", // For Firefox
    msOverflowStyle: "none", // For Internet Explorer and Edge
    "&::-webkit-scrollbar": {
      display: "none", // For Chrome, Safari, and Opera
    },
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    mb: 2,
  };

  const closeButtonStyle = {
    color: "text.primary",
    ":hover": {
      bgcolor: "action.hover",
    },
  };

  const selectStyle = {
    marginTop: 2,
    marginBottom: 2,
  };

  const handleFormChange = (event) => {
    setSelectedForm(event.target.value);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStyle}>
        <Box sx={headerStyle}>
          <Typography id="modal-title" variant="h6" component="h2">
            Request Form
          </Typography>
          <IconButton
            sx={closeButtonStyle}
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <FormControl fullWidth sx={selectStyle}>
          <InputLabel id="form-select-label">Select Form</InputLabel>
          <Select
            labelId="form-select-label"
            value={selectedForm}
            onChange={handleFormChange}
            variant="outlined"
            color="primary"
          >
            <MenuItem value="SiteExpenditure">Site Expenditures</MenuItem>
            <MenuItem value="MaterialandPOPayment">
              Material and PO Payment
            </MenuItem>
            <MenuItem value="General">General</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ mt: 2 }}>
          {selectedForm === "SiteExpenditure" && <PaymentDetailForm />}
          {selectedForm === "MaterialandPOPayment" && <PaymentRequest />}
          {selectedForm === "General" && <General />}
        </Box>
      </Box>
    </Modal>
  );
}

export default MainForm;
