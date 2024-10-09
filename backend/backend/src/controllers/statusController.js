// const { adminDb } = require("../config/firebaseConfig");

// const role = {
//   roles_1: "Admin",
//   roles_2: "User",
//   roles_3: "Accountant",
//   roles_4: "SuperAdmin",
// };

// const statusDef = {
//   initial: "Submitted",
//   phase1: "Approved",
//   phase2: "Uploaded to Bank",
//   phase3: "Payment done,Awaiting for Bills",
//   phase4: "Bills Quality Hold",
//   final: "Bills Accepted",
//   fail: "Denied",
//   qualityfail: "Bills Quality failed",
//   Suspend: "Suspended",
// };

// exports.StatusController = async (req, res) => {
//   const userRole = req.user.role;
//   const { id, action, data, currentStatus } = req.body;
//   console.log(
//     `id : ${id} action ${action} data ${data} currentStatus ${currentStatus}`
//   );

//   try {
//     // Get the transaction document reference
//     const transactionRef = adminDb.collection("transactions").doc(id);
//     const transactionSnapshot = await transactionRef.get();

//     if (!transactionSnapshot.exists) {
//       return res.status(404).json({ error: "Transaction not found" });
//     }

//     // Admin or SuperAdmin logic when currentStatus is "Submitted"
//     if (
//       (userRole === role.roles_1 || userRole === role.roles_4) &&
//       currentStatus === statusDef.initial
//     ) {
//       if (action) {
//         // Update status to "Approved"
//         await transactionRef.update({
//           status: statusDef.phase1,
//           permitteby: data.permitteby,
//         });
//         return res.status(200).json({ message: "Transaction approved" });
//       } else {
//         // Update status to "Denied"
//         await transactionRef.update({
//           status: statusDef.fail,
//           rejectedcause: data.rejectedcause,
//           permitteby: data.permitteby,
//         });
//         return res.status(200).json({ message: "Transaction denied" });
//       }
//     }

//     // Accountant logic
//     if (userRole === role.roles_3) {
//       // If currentStatus is "Approved"
//       if (currentStatus === statusDef.phase1) {
//         if (action) {
//           // Update status to "Uploaded to Bank"
//           await transactionRef.update({
//             status: statusDef.phase2,
//           });
//           return res
//             .status(200)
//             .json({ message: "Transaction uploaded to bank" });
//         } else {
//           // Update status to "Denied"
//           await transactionRef.update({
//             status: statusDef.fail,
//             rejectedcause: data.rejectedcause,
//           });
//           return res.status(200).json({ message: "Transaction denied" });
//         }
//       }

//       // If currentStatus is "Uploaded to Bank"
//       if (currentStatus === statusDef.phase2) {
//         await transactionRef.update({
//           status: statusDef.phase3,
//           AccountantUri: data.AccountantUri,
//         });
//         return res.status(200).json({ message: "Bills Quality Hold set" });
//       }

//       // If currentStatus is "Bills Quality Hold"
//       if (currentStatus === statusDef.phase4) {
//         if (action) {
//           // Update status to "Bills Accepted"
//           await transactionRef.update({
//             status: statusDef.final,
//           });
//           return res.status(200).json({ message: "Bills accepted" });
//         } else {
//           // Update status to "Bills Quality Hold" (status remains the same)
//           await transactionRef.update({
//             status: statusDef.qualityfail,
//             rejectedcause: data.rejectedcause,
//           });
//           return res.status(200).json({ message: "Bills quality failed" });
//         }
//       }

//       // If currentStatus is "Payment done,Awaiting for Bills"
//     }
//     if (
//       currentStatus === statusDef.phase3 ||
//       (userRole === role.roles_2 && currentStatus === statusDef.qualityfail)
//     ) {
//       await transactionRef.update({
//         status: statusDef.phase4,
//         Recipts: data.Recipts,
//       });
//       return res.status(200).json({
//         message: "Receipts uploaded, status set to Bills Quality Hold",
//       });
//     }

//     // If no valid case matched
//     return res
//       .status(400)
//       .json({ error: "Invalid role or status combination" });
//   } catch (error) {
//     console.error("Error updating transaction status:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// exports.SuspendController = async (req, res) => {
//   try {
//     const { id } = req.body;
//     const transactionRef = adminDb.collection("transactions").doc(id);
//     const transactionSnapshot = await transactionRef.get();
//     if (!transactionSnapshot.exists) {
//       return res.status(404).json({ error: "Transaction not found" });
//     }
//     await transactionRef.update({
//       status: statusDef.Suspend,
//     });
//     res.status(200).json({ message: `Transaction is Suspended` });
//   } catch (error) {
//     res.status(400).json({
//       message: `Internal Server Error`,
//     });
//   }
// };

// import { adminDb } from "../config/firebaseConfig.js";

// const role = {
//   roles_1: "Admin",
//   roles_2: "User",
//   roles_3: "Accountant",
//   roles_4: "SuperAdmin",
// };

// const statusDef = {
//   initial: "Submitted",
//   phase1: "Approved",
//   phase2: "Uploaded to Bank",
//   phase3: "Payment done, Awaiting for Bills",
//   phase4: "Bills Quality Hold",
//   final: "Bills Accepted",
//   fail: "Denied",
//   qualityfail: "Bills Quality failed",
//   Suspend: "Suspended",
// };

// // StatusController function
// export const StatusController = async (req, res) => {
//   const userRole = req.user.role;
//   const { id, action, data, currentStatus } = req.body;
//   console.log(
//     `id : ${id} action ${action} data ${data} currentStatus ${currentStatus}`
//   );
//   console.log(userRole);

//   try {
//     // Get the transaction document reference
//     const transactionRef = adminDb.collection("transactions").doc(id);
//     const transactionSnapshot = await transactionRef.get();

//     if (!transactionSnapshot.exists) {
//       return res.status(404).json({ error: "Transaction not found" });
//     }

//     // Admin or SuperAdmin logic when currentStatus is "Submitted"
//     if (
//       (userRole === role.roles_1 && currentStatus === statusDef.initial) ||
//       (userRole === role.roles_4 && currentStatus === statusDef.initial)
//     ) {
//       if (action) {
//         // Update status to "Approved"
//         await transactionRef.update({
//           status: statusDef.phase1,
//           permitteby: data.permitteby,
//         });
//         return res.status(200).json({ message: "Transaction approved" });
//       } else {
//         // Update status to "Denied"
//         await transactionRef.update({
//           status: statusDef.fail,
//           rejectedcause: data.rejectedcause,
//           permitteby: data.permitteby,
//         });
//         return res.status(200).json({ message: "Transaction denied" });
//       }
//     }

//     // Accountant logic
//     if (userRole === role.roles_3) {
//       // If currentStatus is "Approved"
//       if (currentStatus === statusDef.phase1) {
//         if (action) {
//           // Update status to "Uploaded to Bank"
//           await transactionRef.update({
//             status: statusDef.phase2,
//           });
//           return res
//             .status(200)
//             .json({ message: "Transaction uploaded to bank" });
//         } else {
//           // Update status to "Denied"
//           await transactionRef.update({
//             status: statusDef.fail,
//             rejectedcause: data.rejectedcause,
//           });
//           return res.status(200).json({ message: "Transaction denied" });
//         }
//       }

//       // If currentStatus is "Uploaded to Bank"
//       if (currentStatus === statusDef.phase2) {
//         await transactionRef.update({
//           status: statusDef.phase3,
//           AccountantUri: data.AccountantUri,
//         });
//         return res.status(200).json({ message: "Bills Quality Hold set" });
//       }

//       // If currentStatus is "Bills Quality Hold"
//       if (currentStatus === statusDef.phase4) {
//         if (action) {
//           // Update status to "Bills Accepted"
//           await transactionRef.update({
//             status: statusDef.final,
//           });
//           return res.status(200).json({ message: "Bills accepted" });
//         } else {
//           // Update status to "Bills Quality Hold" (status remains the same)
//           await transactionRef.update({
//             status: statusDef.qualityfail,
//             rejectedcause: data.rejectedcause,
//           });
//           return res.status(200).json({ message: "Bills quality failed" });
//         }
//       }

//       // If currentStatus is "Payment done,Awaiting for Bills"
//     }
//     if (
//       currentStatus === statusDef.phase3 ||
//       currentStatus === statusDef.qualityfail
//     ) {
//       console.log("Inside phase3");
//       await transactionRef.update({
//         status: statusDef.phase4,
//         Recipts: data.Recipts,
//       });
//       return res.status(200).json({
//         message: "Receipts uploaded, status set to Bills Quality Hold",
//       });
//     }

//     // If no valid case matched
//     return res
//       .status(400)
//       .json({ error: "Invalid role or status combination" });
//   } catch (error) {
//     console.error("Error updating transaction status:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// // SuspendController function
// export const SuspendController = async (req, res) => {
//   try {
//     const { id } = req.body;
//     const transactionRef = adminDb.collection("transactions").doc(id);
//     const transactionSnapshot = await transactionRef.get();
//     if (!transactionSnapshot.exists) {
//       return res.status(404).json({ error: "Transaction not found" });
//     }
//     await transactionRef.update({
//       status: statusDef.Suspend,
//     });
//     res.status(200).json({ message: "Transaction is Suspended" });
//   } catch (error) {
//     res.status(400).json({
//       message: "Internal Server Error",
//     });
//   }
// };
import { adminDb } from "../config/firebaseConfig.js";

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

    // Admin or SuperAdmin logic when currentStatus is "Submitted"
    if (
      (userRole === role.roles_1 && currentStatus === statusDef.initial) ||
      (userRole === role.roles_4 && currentStatus === statusDef.initial)
    ) {
      if (action) {
        // Update status to "Approved"
        await transactionRef.update({
          status: statusDef.phase1,
          permitteby: data.permitteby,
        });
        return res.status(200).json({ message: "Transaction approved" });
      } else {
        // Update status to "Denied"
        await transactionRef.update({
          status: statusDef.fail,
          rejectedcause: data.rejectedcause,
          permitteby: data.permitteby,
        });
        return res.status(200).json({ message: "Transaction denied" });
      }
    }

    // Accountant logic
    if (userRole === role.roles_3) {
      // If currentStatus is "Approved"
      if (currentStatus === statusDef.phase1) {
        if (action) {
          // Update status to "Uploaded to Bank"
          await transactionRef.update({
            status: statusDef.phase2,
          });
          return res
            .status(200)
            .json({ message: "Transaction uploaded to bank" });
        } else {
          // Update status to "Denied"
          await transactionRef.update({
            status: statusDef.fail,
            rejectedcause: data.rejectedcause,
          });
          return res.status(200).json({ message: "Transaction denied" });
        }
      }

      // If currentStatus is "Uploaded to Bank"
      if (currentStatus === statusDef.phase2) {
        await transactionRef.update({
          status: statusDef.phase3,
          AccountantUri: data.AccountantUri,
        });
        return res.status(200).json({ message: "Bills Quality Hold set" });
      }

      // If currentStatus is "Bills Quality Hold"
      if (currentStatus === statusDef.phase4) {
        if (action) {
          // Update status to "Bills Accepted"
          await transactionRef.update({
            status: statusDef.final,
          });
          return res.status(200).json({ message: "Bills accepted" });
        } else {
          // Update status to "Bills Quality Hold" (status remains the same)
          await transactionRef.update({
            status: statusDef.qualityfail,
            rejectedcause: data.rejectedcause,
          });
          return res.status(200).json({ message: "Bills quality failed" });
        }
      }

      // If currentStatus is "Payment done,Awaiting for Bills"
    }
    if (
      currentStatus === statusDef.phase3 ||
      currentStatus === statusDef.qualityfail
    ) {
      await transactionRef.update({
        status: statusDef.phase4,
        Recipts: data.Recipts,
      });
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
    await transactionRef.update({
      status: statusDef.Suspend,
    });
    res.status(200).json({ message: "Transaction is Suspended" });
  } catch (error) {
    res.status(400).json({
      message: "Internal Server Error",
    });
  }
};