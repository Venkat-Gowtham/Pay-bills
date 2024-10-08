// require("dotenv").config();
import React, { useState, useContext, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
  Divider,
  Button,
  useMediaQuery,
  useTheme,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./popupcard.module.css";
import { DataContext } from "../../context/dataprovider";
import axios from "axios";

const PopupCard = ({ open, onClose, data, userData }) => {
  const [pickFiles, setPickFiles] = useState(false);
  const [field, setField] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [declineReasonVisible, setDeclineReasonVisible] = useState(false);
  const [selectedDeclineReason, setSelectedDeclineReason] = useState("");

  const { statusColors, statusDef, role } = useContext(DataContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Reference to hidden file input
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (data) {
      // Check if data is available
      if (
        (data.status === statusDef.phase3 ||
          data.status === statusDef.qualityfail) &&
        data.senderId === userData.email
      ) {
        setField("uploadReceipts");
        setPickFiles(true);
      } else if (
        data.status === statusDef.phase2 &&
        data.AccountantId === userData.email
      ) {
        setField("paymentDone");
        setPickFiles(true);
      } else {
        setPickFiles(false); // Reset if the condition isn't met
      }
    }
  }, [data, userData.email, statusDef]);

  if (!data) return null;

  const {
    amount,
    details,
    projectId,
    status,
    timestamp,
    urilinks,
    AccountantUri,
    Recipts,
    permitteby,
  } = data;

  const uploadedDateTime = new Date(timestamp).toLocaleString();

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };

  const handleDeclineReasonChange = (event) => {
    setSelectedDeclineReason(event.target.value);
  };

  const handleConfirmDecline = () => {
    handleStatus(false, {
      rejectedcause: selectedDeclineReason,
      permitteby: {
        id: userData.email,
        name: userData.name,
      },
    });
    setDeclineReasonVisible(false);
  };

  const getStatusStyles = (currentStatus) => {
    switch (currentStatus) {
      case statusDef.initial:
        return { backgroundColor: statusColors.initial };
      case statusDef.phase1:
        return { backgroundColor: statusColors.phase1 };
      case statusDef.phase2:
        return { backgroundColor: statusColors.phase2 };
      case statusDef.phase3:
        return { backgroundColor: statusColors.phase3 };
      case statusDef.phase4:
        return { backgroundColor: statusColors.phase4 };
      case statusDef.final:
        return { backgroundColor: statusColors.final };
      default:
        return { backgroundColor: "#D32F2F" }; // Default for unknown statuses
    }
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
      alert("Uploaded Image");
      return result.secure_url;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
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

  const handleStatus = async (action, additionalData = {}) => {
    const token = localStorage.getItem("token");
    console.log(
      `id : ${data.id} action ${action} data ${JSON.stringify(
        additionalData
      )} currentStatus ${data.status}`
    );

    const response = await axios.post(
      `http://localhost:8080/api/updatestatus/statusControll`,
      {
        id: data.id,
        action,
        data: additionalData,
        currentStatus: data.status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      alert(response.data.message);
    }
    console.log(response.data);
  };

  const handleSuspend = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `http://localhost:8080/api/updatestatus/suspendControll`,
      {
        id: data.id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      alert(response.data.message);
    } else {
      console.log(response.data);
    }
    console.log(response.data);
  };

  const handleStatusWithImages = async () => {
    try {
      const imageUrls = await Promise.all(
        selectedFiles.map((file) => uploadImage(file))
      );
      console.log(
        `uploaded image urls are ${imageUrls}  and field is ${field}`
      );
      if (field === "paymentDone") {
        handleStatus(true, { AccountantUri: imageUrls });
        return;
      }
      if (field === "uploadReceipts") {
        handleStatus(true, { Recipts: imageUrls });
        return;
      }
    } catch (error) {
      console.error("Error sending data:", error);
      alert("Error setting status");
    }
  };

  const renderButtons = () => {
    if (status === statusDef.Suspend) {
      return null;
    }

    if (
      (status === statusDef.initial && userData.email === data.receiverId) ||
      (userData.role === role.roles_4 && status === statusDef.initial)
    ) {
      return (
        <>
          <Button
            onClick={() =>
              handleStatus(true, {
                permitteby: { id: userData.email, name: userData.name },
              })
            }
            variant="contained"
            style={{ backgroundColor: "#4CAF50", color: "#FFFFFF" }}
          >
            Accept
          </Button>
          <Button
            onClick={() => setDeclineReasonVisible(true)}
            variant="contained"
            style={{ backgroundColor: "#F44336", color: "#FFFFFF" }}
          >
            Decline
          </Button>
        </>
      );
    }

    if (status === statusDef.phase1 && data.AccountantId === userData.email) {
      return (
        <>
          <Button
            onClick={() => handleStatus(true)}
            variant="contained"
            style={{ backgroundColor: "#4CAF50", color: "#FFFFFF" }}
          >
            Upload to Bank
          </Button>
          <Button
            onClick={() => setDeclineReasonVisible(true)}
            variant="contained"
            style={{ backgroundColor: "#F44336", color: "#FFFFFF" }}
          >
            Decline
          </Button>
        </>
      );
    }

    if (status === statusDef.phase2 && data.AccountantId === userData.email) {
      return (
        <>
          <Button
            onClick={() => {
              handleStatusWithImages();
            }}
            variant="contained"
            style={{ backgroundColor: "#4CAF50", color: "#FFFFFF" }}
          >
            Payment Done
          </Button>
        </>
      );
    }

    if (
      (status === statusDef.phase3 || status === statusDef.qualityfail) &&
      data.senderId === userData.email
    ) {
      return (
        <>
          <Button
            onClick={() => {
              handleStatusWithImages(); // Correctly call the function here
            }}
            variant="contained"
            style={{ backgroundColor: "#4CAF50", color: "#FFFFFF" }}
          >
            Upload Receipts
          </Button>
        </>
      );
    }

    if (status === statusDef.phase4 && data.AccountantId === userData.email) {
      return (
        <>
          <Button
            onClick={() => handleStatus(true)}
            variant="contained"
            style={{ backgroundColor: "#4CAF50", color: "#FFFFFF" }}
          >
            Accept
          </Button>
          <Button
            onClick={() => setDeclineReasonVisible(true)}
            variant="contained"
            style={{ backgroundColor: "#F44336", color: "#FFFFFF" }}
          >
            Decline
          </Button>
        </>
      );
    }

    if (
      status === statusDef.qualityfail &&
      data.AccountantId === userData.email
    ) {
      return (
        <Button
          onClick={handleSuspend}
          variant="contained"
          style={{ backgroundColor: "#4CAF50", color: "#FFFFFF" }}
        >
          Suspend
        </Button>
      );
    }

    return null;
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        fullScreen={fullScreen}
        classes={{ paper: styles.dialogPaper }}
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              <strong>{data.PaymentMethods}</strong>
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography>
                <strong>Amount:</strong> {amount}
              </Typography>
              <Typography>
                <strong>Details:</strong> {details}
              </Typography>
              <Typography>
                <strong>Status:</strong>
                <Chip
                  label={status}
                  style={getStatusStyles(status)} // Apply status color
                />
              </Typography>
            </Box>
            <Box>
              <Typography>
                <strong>Uploaded DateTime:</strong> {uploadedDateTime}
              </Typography>
              <Typography>
                <strong>Project:</strong> {projectId}
              </Typography>
              <Typography>
                <strong>Transaction ID:</strong> {data.id}
              </Typography>
            </Box>
          </Box>
          <Divider style={{ marginTop: "2px", marginBottom: "2px" }} />
          {permitteby?.id && permitteby?.name && (
            <Typography>
              <strong>Permitted By:</strong> {permitteby.name} (ID:{" "}
              {permitteby.id})
            </Typography>
          )}
          <Divider />
          <Box>
            <Typography variant="h6">Attachments:</Typography>
            <Box display="flex" flexWrap="wrap">
              {urilinks.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Attachment ${index + 1}`}
                  onClick={() => handleImageClick(url)}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    cursor: "pointer",
                    marginRight: "10px",
                    marginBottom: "10px",
                  }}
                />
              ))}
            </Box>

            {AccountantUri && AccountantUri.length > 0 && (
              <>
                <Typography variant="h6">Accountant Attachments:</Typography>
                <Box display="flex" flexWrap="wrap">
                  {AccountantUri.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Accountant Attachment ${index + 1}`}
                      onClick={() => handleImageClick(url)}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        cursor: "pointer",
                        marginRight: "10px",
                        marginBottom: "10px",
                      }}
                    />
                  ))}
                </Box>
              </>
            )}

            {Recipts && Recipts.length > 0 && (
              <>
                <Typography variant="h6">Receipts:</Typography>
                <Box display="flex" flexWrap="wrap">
                  {Recipts.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Receipt ${index + 1}`}
                      onClick={() => handleImageClick(url)}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        cursor: "pointer",
                        marginRight: "10px",
                        marginBottom: "10px",
                      }}
                    />
                  ))}
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
        <Divider />
        {pickFiles && (
          <Box
            mt={2}
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current.click()}
              style={{ marginRight: "10px" }}
            >
              Pick Files
            </Button>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }} // Hide the actual file input
            />
            <Typography variant="body1">
              {selectedFiles.length > 0
                ? `${selectedFiles.length} file(s) selected`
                : "No files selected"}
            </Typography>
          </Box>
        )}
        <DialogActions>{renderButtons()}</DialogActions>
      </Dialog>

      {/* Image modal */}
      {selectedImage && (
        <Dialog open={true} onClose={handleCloseImageModal}>
          <img
            src={selectedImage}
            alt="Preview"
            style={{ width: "100%", height: "auto" }}
          />
        </Dialog>
      )}

      {/* Decline reason modal */}
      {declineReasonVisible && (
        <Dialog
          open={declineReasonVisible}
          onClose={() => setDeclineReasonVisible(false)}
        >
          <DialogTitle>Decline Transaction</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel>Reason for Decline</InputLabel>
              <Select
                value={selectedDeclineReason}
                onChange={handleDeclineReasonChange}
              >
                <MenuItem value="Insufficient funds">
                  Insufficient funds
                </MenuItem>
                <MenuItem value="Documentation issues">
                  Documentation issues
                </MenuItem>
                <MenuItem value="Transaction mismatch">
                  Transaction mismatch
                </MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleConfirmDecline}
              variant="contained"
              color="primary"
              disabled={!selectedDeclineReason}
            >
              Confirm Decline
            </Button>
            <Button
              onClick={() => setDeclineReasonVisible(false)}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default PopupCard;
