
// const { adminDb } = require("../config/firebaseConfig");
import { adminDb } from "../config/firebaseConfig.js";
// const fs = require("fs");
import fs from "fs";
import xlsx from "xlsx";
// const xlsx = require("xlsx");
import path from "path";
// const path = require("path");

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE_PATH = path.join(__dirname, "../../data.xlsx");

const role = {
  roles_1: "Admin",
  roles_2: "User",
  roles_3: "Accountant",
  roles_4: "SuperAdmin",
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

export const StatusController = async (req, res) => {
  const userRole = req.user.role;
  const { id, action, data, currentStatus } = req.body;
  console.log(
    `id : ${id} action ${action} data ${data} currentStatus ${currentStatus}`
  );

  try {
    // Get the transaction document reference
    const transactionRef = adminDb.collection("transactions").doc(id);
    const transactionSnapshot = await transactionRef.get();

    if (!transactionSnapshot.exists) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Function to update status in Excel file
    const updateStatusInExcel = (transactionId, newStatus) => {
      if (fs.existsSync(FILE_PATH)) {
        const workbook = xlsx.readFile(FILE_PATH); // Read the Excel file
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Get the first sheet
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Find the row that matches the transaction ID
        const rowIndex = data.findIndex(
          (row) => row["Transaction ID"] === transactionId
        );

        if (rowIndex !== -1) {
          data[rowIndex].status = newStatus; // Update the status
          const updatedSheet = xlsx.utils.json_to_sheet(data); // Convert the updated data back to sheet
          workbook.Sheets["Data"] = updatedSheet;
          xlsx.writeFile(workbook, FILE_PATH); // Save the updated workbook
        }
      }
    };

    let newStatus = "";
    // Admin or SuperAdmin logic when currentStatus is "Submitted"
    if (
      (userRole === role.roles_1 && currentStatus === statusDef.initial) ||
      (userRole === role.roles_4 && currentStatus === statusDef.initial)
    ) {
      if (action) {
        newStatus = statusDef.phase1; // Update status to "Approved"
        await transactionRef.update({
          status: newStatus,
          permitteby: data.permitteby,
        });
        updateStatusInExcel(id, newStatus); // Update status in Excel
        return res.status(200).json({ message: "Transaction approved" });
      } else {
        newStatus = statusDef.fail; // Update status to "Denied"
        await transactionRef.update({
          status: newStatus,
          rejectedcause: data.rejectedcause,
          permitteby: data.permitteby,
        });
        updateStatusInExcel(id, newStatus); // Update status in Excel
        return res.status(200).json({ message: "Transaction denied" });
      }
    }

    // Accountant logic
    if (userRole === role.roles_3) {
      // If currentStatus is "Approved"
      if (currentStatus === statusDef.phase1) {
        if (action) {
          newStatus = statusDef.phase2; // Update status to "Uploaded to Bank"
          await transactionRef.update({
            status: newStatus,
          });
          updateStatusInExcel(id, newStatus); // Update status in Excel
          return res
            .status(200)
            .json({ message: "Transaction uploaded to bank" });
        } else {
          newStatus = statusDef.fail; // Update status to "Denied"
          await transactionRef.update({
            status: newStatus,
            rejectedcause: data.rejectedcause,
          });
          updateStatusInExcel(id, newStatus); // Update status in Excel
          return res.status(200).json({ message: "Transaction denied" });
        }
      }

      // If currentStatus is "Uploaded to Bank"
      if (currentStatus === statusDef.phase2) {
        newStatus = statusDef.phase3; // Update status to "Payment done,Awaiting for Bills"
        await transactionRef.update({
          status: newStatus,
          AccountantUri: data.AccountantUri,
        });
        updateStatusInExcel(id, newStatus); // Update status in Excel
        return res.status(200).json({ message: "Bills Quality Hold set" });
      }

      // If currentStatus is "Bills Quality Hold"
      if (currentStatus === statusDef.phase4) {
        if (action) {
          newStatus = statusDef.final; // Update status to "Bills Accepted"
          await transactionRef.update({
            status: newStatus,
          });
          updateStatusInExcel(id, newStatus); // Update status in Excel
          return res.status(200).json({ message: "Bills accepted" });
        } else {
          newStatus = statusDef.qualityfail; // Update status to "Bills Quality failed"
          await transactionRef.update({
            status: newStatus,
            rejectedcause: data.rejectedcause,
          });
          updateStatusInExcel(id, newStatus); // Update status in Excel
          return res.status(200).json({ message: "Bills quality failed" });
        }
      }
    }

    // If currentStatus is "Payment done,Awaiting for Bills"
    if (
      currentStatus === statusDef.phase3 ||
      currentStatus === statusDef.qualityfail
    ) {
      const updatedData = {
        status: statusDef.phase4,
        Recipts: data.Recipts,
      };

      // Only add Receipts if it exists in the data

      await transactionRef.update(updatedData);
      updateStatusInExcel(id, statusDef.phase4);
      return res.status(200).json({
        message: "Receipts uploaded, status set to Bills Quality Hold",
      });
    }

    // If no valid case matched
    return res
      .status(400)
      .json({ error: "Invalid role or status combination" });
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const SuspendController = async (req, res) => {
  try {
    const { id } = req.body;
    const transactionRef = adminDb.collection("transactions").doc(id);
    const transactionSnapshot = await transactionRef.get();

    if (!transactionSnapshot.exists) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const newStatus = statusDef.Suspend;
    await transactionRef.update({
      status: newStatus,
    });

    // Update status in Excel
    const updateStatusInExcel = (transactionId, newStatus) => {
      if (fs.existsSync(FILE_PATH)) {
        const workbook = xlsx.readFile(FILE_PATH); // Read the Excel file
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Get the first sheet
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Find the row that matches the transaction ID
        const rowIndex = data.findIndex(
          (row) => row["Transaction ID"] === transactionId
        );

        if (rowIndex !== -1) {
          data[rowIndex].status = newStatus; // Update the status
          const updatedSheet = xlsx.utils.json_to_sheet(data); // Convert the updated data back to sheet
          workbook.Sheets["Data"] = updatedSheet;
          xlsx.writeFile(workbook, FILE_PATH); // Save the updated workbook
        }
      }
    };

    updateStatusInExcel(id, newStatus); // Update status in Excel

    res.status(200).json({ message: "Transaction is Suspended" });
  } catch (error) {
    res.status(400).json({
      message: 'Internal Server Error',
    });
  }
};