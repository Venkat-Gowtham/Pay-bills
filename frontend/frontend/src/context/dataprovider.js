import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import sendPushNotification from "../utils/sendPushNotifications.js";
const AUTH_API = process.env.REACT_APP_AUTH_API;
const AUTH_USER = process.env.REACT_APP_AUTH_USER;
const NOTIFY_USER = process.env.REACT_APP_NOTIFY_USER;
const TRANSACTIONS_API = process.env.REACT_APP_TRANSACTIONS_API;
const IMAGE_UPLOAD = process.env.REACT_APP_IMAGE_UPLOAD;
const UPDATE_STATUS = process.env.REACT_APP_UPDATE_STATUS;
// Create a context
export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    email: "",
    mappedAdminId: "",
    mappedAccountantId: "",
    name: "",
    projectId: "",
    role: "",
  });

  const role = {
    roles_1: "Admin",
    roles_2: "User",
    roles_3: "Accountant",
    roles_4: "SuperAdmin",
  };

  const statusColors = {
    initial: "#B0BEC5", // Light Grey - Submitted
    phase1: "#66BB6A", // Green - Approved
    phase2: "#42A5F5", // Blue - Uploaded to bank
    phase3: "#FFA726", // Orange - Payment done, awaiting bills
    phase4: "#FB8C00", // Dark Orange - Bills quality hold
    final: "#5C6BC0", // Dark Blue - Bills accepted
    fail: "#EF5350", // Red - Denied
    qualityfail: "#db3947", // Dark Red - Bills Quality failed
    suspend: "#8E24AA", // Purple - Suspended
  };

  const statusDef = {
    initial: "Submitted",
    phase1: "Approved",
    phase2: "Uploaded to Bank",
    phase3: "Payment done,Awaiting for Bills",
    phase4: "Bills Quality Hold",
    final: "Bills Accepted",
    fail: "Denied",
    qualityfail: "Bills Quality failed",
    Suspend: "Suspended",
  };

  // Fetch stored client data from local storage
  const storedClientId = localStorage.getItem("clientId");

  // Fetch data on mount or when clientId changes
  useEffect(() => {
    const storedAdminId = localStorage.getItem("adminEmail");
    const storedAccountantId = localStorage.getItem("accountantEmail");

    if (storedClientId) {
      // Rehydrate state from localStorage
      setUserData((prevUserData) => ({
        ...prevUserData,
        mappedAdminId: storedAdminId || "",
        mappedAccountantId: storedAccountantId || "",
      }));

      // Fetch fresh data from backend if userData isn't already loaded
      if (!userData.email) {
        fetchData(storedClientId);
      }
    }
  }, [storedClientId, userData.email]); // Dependencies updated

  // Fetch user data from the backend API
  const fetchData = async (email) => {
    try {
      const response = await axios.get(
        `${AUTH_USER}/userdata/${email}`
      );

      // Set the user data from the backend response
      setUserData(response.data.userData);

      // Save token and emails in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("adminEmail", response.data.userData.mappedAdminId);
      localStorage.setItem(
        "accountantEmail",
        response.data.userData.mappedAccountantId
      );

      // Fetch admin and accountant tokens
      const adminTokens = await getIdTokenResult(
        response.data.userData.mappedAdminId
      );
      const accountantTokens = await getIdTokenResult(
        response.data.userData.mappedAccountantId
      );

      // Store tokens in localStorage
      localStorage.setItem("AdminTokens", JSON.stringify(adminTokens));
      localStorage.setItem(
        "AccountantTokens",
        JSON.stringify(accountantTokens)
      );

      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  // Fetch tokens based on email
  const getIdTokenResult = async (email) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${TRANSACTIONS_API}/tokens/${email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data || [];
    } catch (err) {
      console.error(`Error fetching tokens for ${email}:`, err);
      return [];
    }
  };

  // Notification function
  const notify = async (email, transactionData) => {
    try {
      let tokens = [];

      // Check if tokens are already stored in localStorage
      if (email === localStorage.getItem("adminEmail")) {
        tokens = JSON.parse(localStorage.getItem("AdminTokens")) || [];
      } else if (email === localStorage.getItem("accountantEmail")) {
        tokens = JSON.parse(localStorage.getItem("AccountantTokens")) || [];
      }

      // Fetch tokens if not found in localStorage
      if (tokens.length === 0) {
        tokens = await getIdTokenResult(email);
      }

      // Send push notifications for each session (token)
      if (tokens.length > 0) {
        tokens.forEach((session) => {
          sendPushNotification(
            session,
            "Payment Request",
            "New Payment Request",
            transactionData
          );
        });
      } else {
        console.log(`No tokens found for ${email}`);
      }
    } catch (err) {
      console.error("Error sending notifications:", err);
    }
  };

  // Clear data if clientId is removed from localStorage (logout scenario)
  useEffect(() => {
    if (!storedClientId) {
      setUserData({
        email: "",
        mappedAdminId: "",
        mappedAccountantId: "",
        name: "",
        projectId: "",
        role: "",
      });
      localStorage.removeItem("token");
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("accountantEmail");
      localStorage.removeItem("AdminTokens");
      localStorage.removeItem("AccountantTokens");
    }
  }, [storedClientId]);

  return (
    <DataContext.Provider
      value={{
        userData,
        loading,
        error,
        fetchData,
        notify,
        getIdTokenResult,
        statusDef,
        role,
        statusColors,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
