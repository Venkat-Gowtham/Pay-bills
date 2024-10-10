// form2

import React, { useState, useContext  , useEffect} from "react";
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
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { DataContext } from "../../context/dataprovider";
import Loader from "../../loader/loader.js";
const TRANSACTIONS_API = process.env.REACT_APP_TRANSACTIONS_API;
const IMAGE_UPLOAD = process.env.REACT_APP_IMAGE_UPLOAD;
function PaymentDetailForm({ initialFormData, handleClose, handleUpdateRow }) {
  const [otherRemarks, setOtherRemarks] = useState("");
  const { userData, notify } = useContext(DataContext);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [removedUrls, setRemovedUrls] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(null);
  const [formState, setFormData] = useState({
    amount: "",
    details: "",
    projectId: "",
    BankId: "",
    development: "",
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
    id: "",
  });
  const [reasons,setReasons] = useState([
    "Material schedule No/Service Reason",
    "Other (Entry manually)",
  ]);
  useEffect(() => {
    if (initialFormData) {
      console.log("initialFormData", initialFormData);
      setFormData(initialFormData);
       const existingUrls = Array.isArray(initialFormData.urilinks) ? initialFormData.urilinks : [];
       setImagePreviews(existingUrls);
       setSelectedFiles([]); // Clear selected files when loading new form data
       setRemovedUrls([]); // Ensure no URLs are marked as removed when loading new data
       if (initialFormData.details) {
        setReasons((prevReasons) => {
          // Create a new array with unique reasons
          const updatedReasons = [...new Set([...prevReasons, initialFormData.details])];
          return updatedReasons; // Set the updated unique reasons
        });
      }
    }
  }, [initialFormData]);
  const projects = ["P23", "P27"];

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "details" && value === "Other (Entry manually)") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        details: value,
      }));
    } else if (name === "otherRemarks") {
      setOtherRemarks(value);
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files); // Convert the FileList to an array
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    const updatedSelectedFiles = [...selectedFiles];
    newFiles.forEach((file) => {
        if (!updatedSelectedFiles.some(selectedFile => selectedFile.name === file.name)) {
            updatedSelectedFiles.push(file); // Add new file if it doesn't already exist
        }
    });
    setSelectedFiles(updatedSelectedFiles); // Update selected files state
    setImagePreviews((prev) => [...prev, ...newPreviews]); 
  };

  const uploadImage = async (image) => {
    const formData = new FormData();
    const mail = userData.email;
    formData.append("file", image);
    formData.append("public_id", `Data/${mail}/upload_${Date.now()}`);
    formData.append("upload_preset", "Default");

    try {
      const response = await fetch(
        `${IMAGE_UPLOAD}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text(); // Get error message from response body
        throw new Error(`Failed to upload image: ${response.status} ${response.statusText} - ${errorMessage}`);
      }
      const result = await response.json();
      alert("Uploaded Image successfully");
      return result.secure_url; // Return the secure URL of the uploaded image
    } catch (error) {
      alert(`Upload failed: ${error.message}`); // Alert user of the error
      return null; // Return null in case of failure
    }
  };

  const formDataToObject = (formData) => {
    console.log("formData");
    const object = {};
    formData.forEach((value, key) => {
      object[key] = value;
    });
    return object;
  };

  const handleRemoveImage = (url) => {
    if (initialFormData.urilinks.includes(url)) {
        setRemovedUrls((prev) => [...prev, url]); // Track removed existing URLs
    }
    setImagePreviews((prev) => prev.filter((img) => img !== url));
    setSelectedFiles((prev) => prev.filter((file) => URL.createObjectURL(file) !== url));
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
      permitteby,
      AccountantId,
      rejectedcause,
      details,
      PaymentMethods,
      BankId,
      development,
    } = formState;
    const finalDetails =
    formState.details === "Other (Entry manually)" ? otherRemarks : details;
    if (
      (ponumber || accountNumber || ifsc) &&
      (!ponumber || !accountNumber || !ifsc)
    ) {
      alert(
        "Please complete all fields: PO Number, Account Number, and IFSC Code."
      );
      return;
    }
    if (!amount || !finalDetails) {
      alert("Please complete all fields: Amount and Remarks");
      return;
    }
    let validImageUrls = [];

      if (selectedFiles.length > 0 || imagePreviews.length > 0) { // Check for new or existing images
        try {
          setLoading(true);
          const existingUrls = Array.isArray(formState.urilinks) ? formState.urilinks : [];
          const filteredExistingUrls = existingUrls.filter(url => !removedUrls.includes(url));
          console.log("filteredExistingUrls", filteredExistingUrls);
          let finalImageUrls = [];
          if (selectedFiles.length > 0) {
            const imageUrls = await Promise.all(
              selectedFiles.map((file) => uploadImage(file)) // Upload actual file objects
            );
            validImageUrls = imageUrls.filter((url) => url !== null);
            if (validImageUrls.length > 0) {
              finalImageUrls = [...new Set([...validImageUrls, ...filteredExistingUrls])];
            }
          }

          // Prepare submission data
          const submissionData = new FormData();
          submissionData.append("projectId", projectId);
          submissionData.append("details", finalDetails);
          submissionData.append("imageUrls", JSON.stringify(finalImageUrls));
          submissionData.append("senderId", userData.email);
          submissionData.append("receiverId", userData.mappedAdminId );
          submissionData.append("senderName", userData.name);
          submissionData.append("amount", amount);
          submissionData.append("ponumber", ponumber);
          submissionData.append("vendorname", vendorname);
          submissionData.append("accountNumber", accountNumber);
          submissionData.append("ifsc", ifsc);
          submissionData.append("PaymentMethods", PaymentMethods || "Material and PO Payments");
          submissionData.append("status", "Submitted");
          submissionData.append("permitteby", permitteby || null);
          submissionData.append("AccountantId", userData.mappedAccountantId || "");
          submissionData.append("rejectedcause", rejectedcause);
          submissionData.append("BankId", BankId);
          submissionData.append("development", development);
          submissionData.append("timestamp", new Date().toISOString());
          const token = localStorage.getItem("token");

          let response;
          if (initialFormData && initialFormData.id) {
            // Update the existing record
            response = await axios.put(
              `${TRANSACTIONS_API}/update/${initialFormData.id}`,
              submissionData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log(response.data.data);
            const updatedRowObject = formDataToObject(submissionData);
            updatedRowObject.id = initialFormData.id;
            handleUpdateRow(updatedRowObject);
            alert("Form updated successfully");
          } else {
            // Create a new record
            response = await axios.post(
              `${TRANSACTIONS_API}/submitform1`,
              submissionData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            alert("Form submitted successfully");
          }
          console.log(response);

          if (response.status === 200) {
            notify(userData.mappedAdminId, {
              project: projectId,
              amount: amount,
              details: finalDetails,
            });

            // Reset state after successful submission
            setSelectedFiles([]);
            setImagePreviews([]);
            setRemovedUrls([]);
            setFormData({
              amount: "",
              details: "",
              projectId: "",
              BankId: "",
              development: "",
              receiverId: "",
              rejectedcause: "",
              senderId: "",
              senderName: "",
              status: "",
              timestamp: "",
              urilinks: [], // Reset urilinks
              AccountantUri: [],
              Recipts: [],
              AccountantId: "",
              permitteby: null,
              PaymentMethods: "Material and PO Payments",
              vendorname: "",
              ponumber: "",
              accountNumber: "",
              ifsc: "",
              id: "",
            });
            setOtherRemarks(""); // Clear the otherRemarks field
            handleClose();
          }
        } catch (error) {
          console.error("Error sending data:", error);
          alert("Error sending data");
        } finally {
          setLoading(false);
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
                  value={formState.projectId}
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
                value={formState.amount}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="PO Number"
                name="ponumber"
                value={formState.ponumber}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Vendor Name"
                name="vendorname"
                value={formState.vendorname}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Account Number"
                name="accountNumber"
                value={formState.accountNumber}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="IFSC Code"
                name="ifsc"
                value={formState.ifsc}
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
                  value={formState.details}
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

            {formState.details === "Other (Entry manually)" && (
              <Grid item xs={12}>
                <TextField
                  label="Enter Remark"
                  name="otherRemarks"
                  value={otherRemarks}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
            )}
            <Divider />
          {Array.isArray(imagePreviews) && imagePreviews.length > 0 && (
            <Box mt={2}>
              <Typography variant="h6">Selected Files:</Typography>
              <Box display="flex" flexWrap="wrap">
                {Array.isArray(imagePreviews) &&  imagePreviews?.map((url, index) => (
                  <Box  position="relative" key={index} marginRight="10px" marginBottom="10px">
                    <img
                    src ={url}
                    alt={`url ${index + 1}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(url)}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      color: "red",
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          <Divider />
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
