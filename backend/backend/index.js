// const express = require("express");
// const cors = require("cors");
// const multer = require("multer");
// const path = require("path");
// const appServer = express();
// const fs = require("fs"); // n
// const xlsx = require("xlsx");
// // const bodyParser = require('body-parser');
// // Import routes
// const authRoutes = require("./src/router/authroutes");
// const transactionRoutes = require("./src/router/transactionRoutes");
// const userRoutes = require("./src/router/userroutes");
// const notificationRoutes = require("./src/router/notificationRoutes");
// const statusRoute = require("./src/router/statusrouter");
// // Middleware
// appServer.use("/images", express.static(path.join(__dirname, "public/images")));
// appServer.use(cors());
// appServer.use(express.json());
// // appServer.use(bodyParser.json());
// appServer.use(express.urlencoded({ extended: true }));
// const upload = multer({ storage: multer.memoryStorage() });
// const FILE_PATH = path.join(__dirname, "data.xlsx");
// // Use routes
// appServer.use("/api/auth", authRoutes);
// appServer.use("/api/transactions", transactionRoutes);
// appServer.use("/api/users", userRoutes);
// appServer.use("/api", notificationRoutes);
// appServer.use("/api/updatestatus", statusRoute);

// // appServer.post("/submit-form", (req, res) => {
// //   const formData = req.body; // Get form data from the client

// //   let workbook;
// //   if (fs.existsSync(FILE_PATH)) {
// //     workbook = xlsx.readFile(FILE_PATH); // Read existing Excel file
// //   } else {
// //     workbook = xlsx.utils.book_new(); // Create a new workbook
// //   }

// //   let worksheet;
// //   if (workbook.SheetNames.length > 0) {
// //     worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Use existing sheet
// //   } else {
// //     worksheet = xlsx.utils.json_to_sheet([]); // Create a new sheet
// //     xlsx.utils.book_append_sheet(workbook, worksheet, "Data");
// //   }

// //   const data = xlsx.utils.sheet_to_json(worksheet); // Convert sheet to JSON
// //   data.push(formData); // Add form data

// //   const updatedSheet = xlsx.utils.json_to_sheet(data); // Convert updated data to sheet
// //   workbook.Sheets["Data"] = updatedSheet;

// //   xlsx.writeFile(workbook, FILE_PATH); // Write back to Excel file

// //   res.status(200).send("Form data saved successfully");
// // });

// // Download Excel File
// // appServer.get("/download", (req, res) => {
// //   if (fs.existsSync(FILE_PATH)) {
// //     res.setHeader("Content-Disposition", 'attachment; filename="data.xlsx"');
// //     res.setHeader(
// //       "Content-Type",
// //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
// //     );
// //     res.download(FILE_PATH); // Serve the file with correct headers
// //   } else {
// //     res.status(404).send("File not found");
// //   }
// // });

// const PORT = process.env.PORT || 8080;
// appServer.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import xlsx from "xlsx";
// Import routes
import authRoutes from "./src/router/authroutes.js";
import transactionRoutes from "./src/router/transactionRoutes.js";
import userRoutes from "./src/router/userroutes.js";
import notificationRoutes from "./src/router/notificationRoutes.js";
import statusRoute from "./src/router/statusrouter.js";

const appServer = express();
const upload = multer({ storage: multer.memoryStorage() });
const FILE_PATH = path.join(process.cwd(), "data.xlsx");

// Middleware
appServer.use("/images", express.static(path.join(process.cwd(), "public/images")));
appServer.use(cors());
appServer.use(express.json());
appServer.use(express.urlencoded({ extended: true }));

// Use routes
appServer.use("/api/auth", authRoutes);
appServer.use("/api/transactions", transactionRoutes);
appServer.use("/api/users", userRoutes);
appServer.use("/api", notificationRoutes);
appServer.use("/api/updatestatus", statusRoute);

const PORT = process.env.PORT || 8080;
appServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
