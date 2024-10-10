import React, { useState, useEffect } from "react";
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

function MainForm({ open, handleClose, editData, handleUpdateRow }) {
  const [selectedForm, setSelectedForm] = useState("SiteExpenditure");

  console.log("editData from main", editData);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isMobile ? "90%" : 600,
    maxHeight: "80vh",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: isMobile ? 2 : 4,
    overflowY: "auto",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": {
      display: "none",
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

  // Update form selection based on `editData`
  useEffect(() => {
    if (editData) {
      let formName = "";
      switch (editData.PaymentMethods) {
        case "Site Expenditure":
          formName = "SiteExpenditure";
          break;
        case "Material and PO Payments":
          formName = "MaterialandPOPayment";
          break;
        case "General":
          formName = "General";
          break;
        default:
          formName = "SiteExpenditure";
      }
      setSelectedForm(formName);
    } else {
      setSelectedForm("SiteExpenditure");
    }
  }, [editData]);

  const handleFormChange = (event) => {
    setSelectedForm(event.target.value);
  };

  // const isValidEditData = editData && typeof editData === "object";
  const isValidEditData = editData && typeof editData === "object" && !Array.isArray(editData) && editData !== null && Object.keys(editData).length > 0;
console.log("isValidEditData", isValidEditData);
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
            {isValidEditData ? "Edit Request" : "New Request"} Form
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
            disabled={isValidEditData}
          >
            <MenuItem value="SiteExpenditure">Site Expenditures</MenuItem>
            <MenuItem value="MaterialandPOPayment">
              Material and PO Payment
            </MenuItem>
            <MenuItem value="General">General</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ mt: 2 }}>
          {selectedForm === "SiteExpenditure" && (
            <PaymentDetailForm
              initialFormData={isValidEditData ? editData : {}}
              handleClose={handleClose}
              handleUpdateRow={handleUpdateRow}
            />
          )}
          {selectedForm === "MaterialandPOPayment" && (
            <PaymentRequest
              initialFormData={isValidEditData ? editData : {}}
              handleClose={handleClose}
              handleUpdateRow={handleUpdateRow}
            />
          )}
          {selectedForm === "General" && (
            <General
              initialFormData={isValidEditData ? editData : {}}
              handleClose={handleClose}
              handleUpdateRow={handleUpdateRow}
            />
          )}
        </Box>
      </Box>
    </Modal>
  );
}

export default MainForm;
