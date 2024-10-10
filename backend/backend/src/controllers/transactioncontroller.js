// const { json } = require("body-parser");
// const { adminDb } = require("../config/firebaseConfig");
// const { Timestamp } = require("firebase-admin/firestore");
// const fs = require("fs"); // n
// const xlsx = require("xlsx");
// const path = require("path");
// const FILE_PATH = path.join(__dirname, "../../data.xlsx");
// const roles = {
//   roles_1: "Admin",
//   roles_2: "User",
//   roles_3: "Accountant",
//   roles_4: "SuperAdmin",
// };

// exports.submitTransaction = async (req, res) => {
//   const {
//     projectId,
//     details,
//     imageUrls,
//     senderId,
//     receiverId,
//     senderName,
//     amount,
//     ponumber,
//     vendorname,
//     accountNumber,
//     ifsc,
//     PaymentMethods,
//     payfor,
//     AccountantId,
//   } = req.body;

//   if (!projectId || !details || !imageUrls) {
//     return res
//       .status(400)
//       .json({ message: "Project, details, and image URLs are required" });
//   }

//   try {
//     let parsedImageUrls =
//       typeof imageUrls === "string" ? JSON.parse(imageUrls) : imageUrls;

//     // bank details submission

//     let BankId = "";

//     // Check if bankDetails are provided
//     // second form
//     if (accountNumber) {
//       // Ensure bank details are complete
//       if (!ifsc || !ponumber || !vendorname || !accountNumber) {
//         return res
//           .status(400)
//           .json({ message: "All bank detail fields are required" });
//       }

//       // Post bank details to the database
//       const bankData = {
//         ifsc,
//         ponumber,
//         vendorname,
//         accountNumber,
//         timestamp: Timestamp.now(),
//       };
//       const bankDocRef = await adminDb.collection("BankDetails").add(bankData);
//       BankId = bankDocRef.id; // Get the ID of the created bank document

//       let workbook;
//       if (fs.existsSync(FILE_PATH)) {
//         workbook = xlsx.readFile(FILE_PATH); // Read existing Excel file
//       } else {
//         workbook = xlsx.utils.book_new(); // Create a new workbook
//       }

//       let worksheet;
//       if (workbook.SheetNames.length > 0) {
//         worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Use existing sheet
//       } else {
//         worksheet = xlsx.utils.json_to_sheet([]); // Create a new sheet
//         xlsx.utils.book_append_sheet(workbook, worksheet, "Data");
//       }

//       const data = xlsx.utils.sheet_to_json(worksheet); // Convert sheet to JSON
//       data.push(bankData); // Add form data

//       const updatedSheet = xlsx.utils.json_to_sheet(data); // Convert updated data to sheet
//       workbook.Sheets["Data"] = updatedSheet;

//       xlsx.writeFile(workbook, FILE_PATH); // Write back to Excel file
//     }

//     // general form
//     let development = "";

//     if (payfor) {
//       const generalData = {
//         payfor,
//         timestamp: Timestamp.now(),
//       };
//       const genDocRef = await adminDb
//         .collection("developmentData")
//         .add(generalData);
//       development = genDocRef.id;
//     }

//     const transactionData = {
//       BankId: BankId || "",
//       amount,
//       PaymentMethods: PaymentMethods || "",
//       Receipts: [],
//       development: development || "",
//       permitteby: {},
//       rejectedcause: "",
//       details: details,
//       editedtime: "NULL",
//       projectId: projectId,
//       receiverId: receiverId || "",
//       senderId: senderId || "",
//       senderName: senderName || "",
//       status: "Submitted",
//       timestamp: Timestamp.now(),
//       urilinks: parsedImageUrls,
//       AccountantUri: [],
//       AccountantId: AccountantId || "",
//     };

//     const docRef = await adminDb
//       .collection("transactions")
//       .add(transactionData);
//     res.status(200).json({
//       message: "Transaction successfully posted",
//       documentId: docRef.id,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to post transaction", error: error.message });
//   }
// };

// // ********************************************

// exports.getTableData = async (req, res) => {
//   const email = req.params.email; // Email from params
//   const role = req.user.role; // Role from authenticated user
//   const projectId = req.user.projectId; // Get the projectId from authenticated user

//   if (!email) {
//     return res.status(400).json({ message: "Email is required" });
//   }

//   try {
//     let query;
//     let transactions = [];

//     // Function to convert Firestore timestamp to a proper JS Date format
//     const formatTimestamp = (timestamp) => {
//       return timestamp ? new Date(timestamp.seconds * 1000) : null;
//     };

//     // Modify the query based on the role
//     switch (role) {
//       case "User":
//         if (!projectId) {
//           return res
//             .status(400)
//             .json({ message: "Project ID is required for users" });
//         }
//         // Fetch data where senderId is the email and projectId matches
//         query = adminDb
//           .collection("transactions")
//           .where("senderId", "==", email)
//           .where("projectId", "==", projectId)
//           .orderBy("timestamp", "desc");
//         break;

//       case "Admin":
//         if (!projectId) {
//           return res
//             .status(400)
//             .json({ message: "Project ID is required for admins" });
//         }
//         // Fetch data where senderId == email or receiverId == email and projectId matches
//         const senderQuery = adminDb
//           .collection("transactions")
//           .where("senderId", "==", email)
//           .where("projectId", "==", projectId)
//           .orderBy("timestamp", "desc");

//         const receiverQuery = adminDb
//           .collection("transactions")
//           .where("receiverId", "==", email)
//           .where("projectId", "==", projectId)
//           .orderBy("timestamp", "desc");

//         // Execute both queries
//         const [senderSnapshot, receiverSnapshot] = await Promise.all([
//           senderQuery.get(),
//           receiverQuery.get(),
//         ]);

//         // Combine the results of both queries
//         transactions = [
//           ...senderSnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           })),
//           ...receiverSnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           })),
//         ];
//         break;

//       case "Accountant":
//         if (!projectId) {
//           return res
//             .status(400)
//             .json({ message: "Project ID is required for accountants" });
//         }
//         // Fetch data where status is NOT "Submitted" and projectId matches
//         query = adminDb
//           .collection("transactions")
//           .where("projectId", "==", projectId)
//           .where("status", "in", [
//             "Approved",
//             "Uploaded to Bank",
//             "Payment done,Awaiting for Bills",
//             "Bills Quality Hold",
//             "Bills Accepted",
//             "Denied",
//             "Bills Quality failed",
//             "Suspended",
//           ])
//           .orderBy("timestamp", "desc");
//         break;

//       case "SuperAdmin":
//         // Fetch all data (no filtering)
//         query = adminDb.collection("transactions").orderBy("timestamp", "desc");
//         break;

//       default:
//         // Handle unexpected role
//         return res.status(400).json({ message: "Invalid role" });
//     }

//     // If there's a query (for User, Accountant, SuperAdmin), execute it
//     if (query) {
//       const transactionSnapshot = await query.get();

//       if (transactionSnapshot.empty) {
//         return res
//           .status(404)
//           .json({ message: "No transactions found for this query" });
//       }

//       transactions = transactionSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//     }

//     // Format the timestamp for all transactions (including Admin case)
//     const formattedTransactions = transactions.map((transaction) => {
//       return {
//         ...transaction,
//         timestamp: formatTimestamp(transaction.timestamp), // Format the Firestore timestamp to JS Date
//       };
//     });

//     // Send the response with formatted timestamps
//     return res.status(200).json({ status: 200, data: formattedTransactions });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to fetch transactions",
//       error: error.message,
//     });
//   }
// };

// // ********************************************

// exports.getTokensById = async (req, res) => {
//   const userId = req.params.email; // Can be adminId or accountId
//   try {
//     const userDoc = await adminDb.collection("Tokens").doc(userId).get();
//     console.log("Stage 3 T");

//     if (!userDoc.exists) {
//       console.log("Stage 3 not exists");

//       return res.status(200).json({ message: "User have no login's" });
//     }

//     const userData = userDoc.data();
//     const tokens = userData.sessions || []; // Assuming tokens are stored in a 'tokens' array

//     res.json(tokens);
//   } catch (error) {
//     console.log("Stage 3 F");
//     console.log(`Stage 3 Server Error`);

//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.downloadExcel = async (req, res) => {
//   const role = req.user.role;
//   console.log(role);
//   try {
//     if (role === roles.roles_3 || role === roles.roles_4) {
//       if (fs.existsSync(FILE_PATH)) {
//         res.setHeader(
//           "Content-Disposition",
//           'attachment; filename="data.xlsx"'
//         );
//         res.setHeader(
//           "Content-Type",
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         );
//         res.status(200).download(FILE_PATH); // Serve the file with correct headers
//       } else {
//         res.status(404).json({ message: "File not found" });
//       }
//     } else {
//       res.status(404).json({ message: `Invalid User Access Download` });
//     }
//   } catch (error) {
//     res.status(400).json({ message: `Internal Server Error` });
//   }
// };


import pkg from 'body-parser';
const { json } = pkg;
import { adminDb } from "../config/firebaseConfig.js"; // Ensure to include .js for ES modules
import { Timestamp } from "firebase-admin/firestore";
import fs from "fs";
import xlsx from "xlsx";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE_PATH = path.join(__dirname, "../../data.xlsx");

const roles = {
  roles_1: "Admin",
  roles_2: "User",
  roles_3: "Accountant",
  roles_4: "SuperAdmin",
};

// Submit transaction
export const submitTransaction = async (req, res) => {
  const {
    projectId,
    details,
    imageUrls,
    senderId,
    receiverId,
    senderName,
    amount,
    ponumber,
    vendorname,
    accountNumber,
    ifsc,
    PaymentMethods,
    payfor,
    AccountantId,
  } = req.body;

  if (!projectId || !details || !imageUrls) {
    return res
      .status(400)
      .json({ message: "Project, details, and image URLs are required" });
  }

  try {
    let parsedImageUrls =
      typeof imageUrls === "string" ? JSON.parse(imageUrls) : imageUrls;

    // Bank details submission
    let BankId = "";

    if (accountNumber) {
      if (!ifsc || !ponumber || !vendorname || !accountNumber) {
        return res
          .status(400)
          .json({ message: "All bank detail fields are required" });
      }

      const bankData = {
        ifsc,
        ponumber,
        vendorname,
        accountNumber,
        timestamp: Timestamp.now(),
      };
      const bankDocRef = await adminDb.collection("BankDetails").add(bankData);
      BankId = bankDocRef.id;

      let workbook;
      if (fs.existsSync(FILE_PATH)) {
        workbook = xlsx.readFile(FILE_PATH);
      } else {
        workbook = xlsx.utils.book_new();
      }

      let worksheet;
      if (workbook.SheetNames.length > 0) {
        worksheet = workbook.Sheets[workbook.SheetNames[0]];
      } else {
        worksheet = xlsx.utils.json_to_sheet([]);
        xlsx.utils.book_append_sheet(workbook, worksheet, "Data");
      }

      const data = xlsx.utils.sheet_to_json(worksheet);
      const currentDate = new Date();

      // Extract day, month, and year
      const day = String(currentDate.getDate()).padStart(2, "0"); // Ensure two digits
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const year = currentDate.getFullYear();

      // Format date as dd-mm-yyyy
      const formattedDate = `${day}-${month}-${year}`;
      const XLData = {
        "Date and Time": formattedDate,
        Amount: amount,
        "Project Id": projectId,
        "Account number": accountNumber,
        "PO number": ponumber,
        "Vendor Name": vendorname,
        "IFSC code": ifsc,
        status: "Submitted",
        Remarks: details,
      };
      data.push(XLData);

      const updatedSheet = xlsx.utils.json_to_sheet(data);
      workbook.Sheets["Data"] = updatedSheet;

      xlsx.writeFile(workbook, FILE_PATH);
    }

    // General form submission
    let development = "";
    if (payfor) {
      const generalData = {
        payfor,
        timestamp: Timestamp.now(),
      };
      const genDocRef = await adminDb
        .collection("developmentData")
        .add(generalData);
      development = genDocRef.id;
    }

    const transactionData = {
      BankId: BankId || "",
      amount,
      PaymentMethods: PaymentMethods || "",
      Receipts: [],
      development: development || "",
      permitteby: {},
      rejectedcause: "",
      details: details,
      editedtime: "NULL",
      projectId: projectId,
      receiverId: receiverId || "",
      senderId: senderId || "",
      senderName: senderName || "",
      status: "Submitted",
      timestamp: Timestamp.now(),
      urilinks: parsedImageUrls,
      AccountantUri: [],
      AccountantId: AccountantId || "",
    };

    const docRef = await adminDb
      .collection("transactions")
      .add(transactionData);
    res.status(200).json({
      message: "Transaction successfully posted",
      documentId: docRef.id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to post transaction", error: error.message });
  }
};

// ********************************************

export const getTableData = async (req, res) => {
  const email = req.params.email; // Email from params
  const role = req.user.role; // Role from authenticated user
  const projectId = req.user.projectId; // Get the projectId from authenticated user

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    let query;
    let transactions = [];

    // Function to convert Firestore timestamp to a proper JS Date format
    const formatTimestamp = (timestamp) => {
      return timestamp ? new Date(timestamp.seconds * 1000) : null;
    };

    // Modify the query based on the role
    switch (role) {
      case "User":
        if (!projectId) {
          return res
            .status(400)
            .json({ message: "Project ID is required for users" });
        }
        // Fetch data where senderId is the email and projectId matches
        query = adminDb
          .collection("transactions")
          .where("senderId", "==", email)
          .where("projectId", "==", projectId)
          .orderBy("timestamp", "desc");
        break;

      case "Admin":
        if (!projectId) {
          return res
            .status(400)
            .json({ message: "Project ID is required for admins" });
        }
        // Fetch data where senderId == email or receiverId == email and projectId matches
        const senderQuery = adminDb
          .collection("transactions")
          .where("senderId", "==", email)
          .where("projectId", "==", projectId)
          .orderBy("timestamp", "desc");

        const receiverQuery = adminDb
          .collection("transactions")
          .where("receiverId", "==", email)
          .where("projectId", "==", projectId)
          .orderBy("timestamp", "desc");

        // Execute both queries
        const [senderSnapshot, receiverSnapshot] = await Promise.all([
          senderQuery.get(),
          receiverQuery.get(),
        ]);

        // Combine the results of both queries
        transactions = [
          ...senderSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
          ...receiverSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        ];
        break;

        case "Accountant":
          if (!projectId) {
              return res
                  .status(400)
                  .json({ message: "Project ID is required for accountants" });
          }
          // Fetch data where status is NOT "Submitted" and projectId matches OR where the senderId is the current accountant's email
          const accountantProjectQuery = adminDb
              .collection("transactions")
              .where("projectId", "==", projectId)
              .where("status", "in", [
                  "Approved",
                  "Uploaded to Bank",
                  "Payment done,Awaiting for Bills",
                  "Bills Quality Hold",
                  "Bills Accepted",
                  "Denied",
                  "Bills Quality failed",
                  "Suspended",
              ])
              .orderBy("timestamp", "desc");
      
          const accountantSenderQuery = adminDb
              .collection("transactions")
              .where("senderId", "==", email)
              .where("projectId", "==", projectId)
              .orderBy("timestamp", "desc");
      
          // Execute both queries for accountants
          const [projectSnapshot, senderSnapshotAcc] = await Promise.all([
              accountantProjectQuery.get(),
              accountantSenderQuery.get(),
          ]);
      
          // Combine the results
          transactions = [
              ...projectSnapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
              })),
              ...senderSnapshotAcc.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
              })),
          ];
          break;

      case "SuperAdmin":
        // Fetch all data (no filtering)
        query = adminDb.collection("transactions").orderBy("timestamp", "desc");
        break;

      default:
        // Handle unexpected role
        return res.status(400).json({ message: "Invalid role" });
    }

    // If there's a query (for User, Accountant, SuperAdmin), execute it
    if (query) {
      const transactionSnapshot = await query.get();

      if (transactionSnapshot.empty) {
        return res
          .status(404)
          .json({ message: "No transactions found for this query" });
      }

      transactions = transactionSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    // Format the timestamp for all transactions (including Admin case)
    const formattedTransactions = transactions.map((transaction) => {
      return {
        ...transaction,
        timestamp: formatTimestamp(transaction.timestamp), // Format the Firestore timestamp to JS Date
      };
    });

    // Send the response with formatted timestamps
    return res.status(200).json({ status: 200, data: formattedTransactions });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};

// ********************************************

export const getTokensById = async (req, res) => {
  const userId = req.params.email; // Can be adminId or accountId
  try {
    const userDoc = await adminDb.collection("Tokens").doc(userId).get();
    console.log("Stage 3 T");

    if (!userDoc.exists) {
      console.log("Stage 3 not exists");

      return res.status(200).json({ message: "User have no login's" });
    }

    const userData = userDoc.data();
    const tokens = userData.sessions || []; // Assuming tokens are stored in a 'tokens' array

    res.json(tokens);
  } catch (error) {
    console.log("Stage 3 F");
    console.log(`Stage 3 Server Error`);

    res.status(500).json({ message: "Server error" });
  }
};

export const downloadExcel = async (req, res) => {
  const role = req.user.role; // Get the role from the authenticated user
  // Check for authorization
  if (role !== "Accountant" && role !== "SuperAdmin") {
    return res
      .status(403)
      .json({ message: "You do not have permission to download the file" });
  }

  // Check if the file exists
  if (!fs.existsSync(FILE_PATH)) {
    return res
      .status(404)
      .json({ message: "No data available for download" });
  }

  res.download(FILE_PATH, "data.xlsx", (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      return res.status(500).json({ message: "Error downloading file" });
    }
  });
};

export const BankDetails = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const bankDoc = await adminDb.collection("BankDetails").doc(id).get();
    if (!bankDoc.exists) {
      return res.status(404).json({ message: "Bank data not found" });
    }

    const bankData = bankDoc.data();
    res.status(200).json(bankData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch bank data", error: error.message });
  }
};

export const DevelopmentDetails = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
      const devDoc = await adminDb.collection('developmentData').doc(id).get();
      if (!devDoc.exists) {
          return res.status(404).json({ message: 'Development data not found' });
      }

      const devData = devDoc.data();
      res.status(200).json(devData);
  } catch (error) {
      res.status(500).json({ message: 'Failed to fetch development data', error: error.message });
  }
}


export const updateTransaction = async (req, res) => {
  console.log("lets see")
  const id = req.params.id;
  console.log(id);
  console.log(req.body);

  const {
      projectId, details, imageUrls, senderId, receiverId, senderName,
      amount, accountNumber, ifsc, ponumber, vendorname, PaymentMethods, payfor,
      status, rejectedcause, permitteby , Receipts
  } = req.body;
  console.log("imageurls", imageUrls);
  let parsedImageUrls =
  typeof imageUrls === "string" ? JSON.parse(imageUrls) : imageUrls;
  console.log("parsedImageUrls :" , parsedImageUrls);
  if (!id) {
      return res.status(400).json({ message: 'Transaction ID is required' });
  }

  try {
      const transactionRef = adminDb.collection('transactions').doc(id);
      const transactionDoc = await transactionRef.get();

      if (!transactionDoc.exists) {
          return res.status(404).json({ message: 'Transaction not found' });
      }

      const transactionData = transactionDoc.data();
      let BankId = transactionData.BankId || "";   // Fetch existing BankId
      let developmentId = transactionData.development || "";  // Fetch existing developmentId

      // Check if bank details exist, else create new bank details document
      // Check if bank details exist, else create new bank details document
      if (BankId) {
          const bankRef = adminDb.collection('BankDetails').doc(BankId);
          const bankDoc = await bankRef.get(); // Fetch the bank document
          if (bankDoc.exists) {
              // Update existing bank details
              const bankUpdateData = {
                  ...(ifsc && { ifsc }),
                  ...(ponumber && { ponumber }),
                  ...(vendorname && { vendorname }),
                  ...(accountNumber && { accountNumber }),
                  timestamp: Timestamp.now(),
              };
              await bankRef.update(bankUpdateData);
          } else {
              // Handle case where the BankId is invalid or the document doesn't exist
              console.log(`No document found for BankId: ${BankId}`);
              return res.status(404).json({ message: `No document found for BankId: ${BankId}` });
          }
      } else if (accountNumber && ifsc && ponumber && vendorname) {
          // Create new bank details if BankId does not exist
          const bankData = {
              ifsc,
              ponumber,
              vendorname,
              accountNumber,
              timestamp: Timestamp.now(),
          };
          const bankDocRef = await adminDb.collection('BankDetails').add(bankData);
          BankId = bankDocRef.id;  // Get the new BankId
      }


      // Check if development data exists, else create new development document
      if (developmentId) {
          // Update existing development data
          const devRef = adminDb.collection('developmentData').doc(developmentId);
          const devUpdateData = {
              ...(payfor && { payfor }),
              timestamp: Timestamp.now(),
          };
          await devRef.update(devUpdateData);
      } else if (payfor) {
          // Create new development data if developmentId does not exist
          const devData = {
              payfor,
              timestamp: Timestamp.now(),
          };
          const devDocRef = await adminDb.collection('developmentData').add(devData);
          developmentId = devDocRef.id;  // Get the new developmentId
      }

      // Prepare transaction update data, including BankId and developmentId
      const updateData = {
          ...(projectId && { projectId }),
          ...(details && { details }),
          ...(parsedImageUrls && { urilinks: parsedImageUrls }),
          ...(senderId && { senderId }),
          ...(receiverId && { receiverId }),
          ...(senderName && { senderName }),
          ...(amount && { amount }),
          ...(PaymentMethods && { PaymentMethods }),
          ...(status && { status }),
          ...(rejectedcause && { rejectedcause }),
          ...(permitteby && { permitteby }),
          ...(Receipts && { Receipts }),
          BankId: BankId || transactionData.BankId,
          development: developmentId || transactionData.development,
          editedtime: Timestamp.now(),
      };

      // Update the transaction with the new data
      await transactionRef.update(updateData);

      res.status(200).json({ message: 'Transaction and associated data updated successfully', data: updateData });
  } catch (error) {
      res.status(500).json({ message: 'Failed to update transaction', error: error.message });
  }
};