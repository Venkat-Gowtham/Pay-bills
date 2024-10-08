// form2

import React, { useState, useContext } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import axios from "axios";
import { DataContext } from "../../context/dataprovider";
import Loader from "../../loader/loader.js";
function PaymentDetailForm() {
  const { userData, notify } = useContext(DataContext);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    details: "",
    projectId: "",
    receiverId: "",
    rejectedcause: "",
    senderId: "",
    senderName: "",
    status: "",
    timestamp: "",
    urilinks: [],
    AccountantUri: [],
    Recipts: [],
    AccountantId: "",
    permitteby: null,
    PaymentMethods: "Material and PO Payments",
    vendorname: "",
    ponumber: "",
    accountNumber: "",
    ifsc: "",
  });

  const reasons = [
    "Material schedule No/Service Reason",
    "Other (Entry manually)",
  ];
  const projects = ["P23", "P27"];

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [
      ...prevFiles,
      ...files.filter(
        (file) => !prevFiles.some((prevFile) => prevFile.name === file.name)
      ),
    ]);
  };

  const uploadImage = async (image) => {
    const formData = new FormData();
    const mail = userData.email;

    formData.append("file", image);
    formData.append("public_id", `Data/${mail}/upload_${Date.now()}`);
    formData.append("upload_preset", "Default");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dowyncdbc/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.statusText}`);
      }
      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const {
      projectId,
      amount,
      ponumber,
      vendorname,
      accountNumber,
      ifsc,
      details,
      PaymentMethods,
    } = formData;

    if (
      (ponumber || accountNumber || ifsc) &&
      (!ponumber || !accountNumber || !ifsc)
    ) {
      alert(
        "Please complete all fields: PO Number, Account Number, and IFSC Code."
      );
      return;
    }

    notify({
      project: projectId,
      amount: amount,
      details: details,
    });

    if (
      selectedFiles.length > 0 &&
      details &&
      amount &&
      projectId &&
      vendorname
    ) {
      try {
        setLoading(true);
        const imageUrls = await Promise.all(
          selectedFiles.map((file) => uploadImage(file))
        );
        const validImageUrls = imageUrls.filter((url) => url !== null);

        if (validImageUrls.length > 0) {
          const submissionData = new FormData();
          submissionData.append("projectId", projectId);
          submissionData.append("details", details);
          submissionData.append("imageUrls", JSON.stringify(validImageUrls));
          submissionData.append("senderId", userData.email);
          submissionData.append("receiverId", userData.mappedAdminId);
          submissionData.append("senderName", userData.name);
          submissionData.append("AccountantId", userData.mappedAccountantId);
          submissionData.append("amount", amount);
          submissionData.append("ponumber", ponumber);
          submissionData.append("vendorname", vendorname);
          submissionData.append("accountNumber", accountNumber);
          submissionData.append("ifsc", ifsc);
          submissionData.append("PaymentMethods", PaymentMethods);

          const token = localStorage.getItem("token");

          const response = await axios.post(
            "http://localhost:8080/api/transactions/submitform1",
            submissionData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200) {
            alert("Form submitted successfully");
            setSelectedFiles([]);
            setFormData({
              projectId: "",
              details: "",
              amount: "",
              ponumber: "",
              vendorname: "",
              accountNumber: "",
              ifsc: "",
              PaymentMethods: "Material and PO Payments",
            });
          }
        } else {
          alert("Image upload failed. Please try again.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error sending data:", error);
        alert("Error sending data");
      }
    } else {
      alert("Please complete all fields before submitting");
    }
  };

  return (
    <>
      <Container>
        <Typography variant="h4" gutterBottom>
          Material and PO Payments
        </Typography>
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleInputChange}
                  required
                >
                  {projects.map((project, index) => (
                    <MenuItem key={index} value={project}>
                      {project}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="PO Number"
                name="ponumber"
                value={formData.ponumber}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Vendor Name"
                name="vendorname"
                value={formData.vendorname}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Account Number"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="IFSC Code"
                name="ifsc"
                value={formData.ifsc}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Remarks</InputLabel>
                <Select
                  label="Remarks"
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                >
                  {reasons.map((reason, index) => (
                    <MenuItem key={index} value={reason}>
                      {reason}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {formData.details === "Other (Entry manually)" && (
              <Grid item xs={12}>
                <TextField
                  label="Enter Remark"
                  name="otherRemarks"
                  value={formData.otherRemarks || ""}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                label="Pick Files"
                name="Recipts"
                type="file"
                inputProps={{ multiple: true }}
                onChange={handleFileChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {selectedFiles.length > 0 && (
                <Box sx={{ marginTop: "16px" }}>
                  <Typography variant="h6">Selected Files:</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      marginTop: "8px",
                    }}
                  >
                    {selectedFiles.map((file, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Typography>{file.name}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>

            {loading && <Loader />}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
}

export default PaymentDetailForm;
