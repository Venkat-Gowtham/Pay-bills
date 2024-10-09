// const { adminDb } = require("../config/firebaseConfig");
// const jwt = require("jsonwebtoken");
// const NodeCache = require("node-cache");
// require("dotenv").config();

// // Create NodeCache instance
// const cache = new NodeCache({ stdTTL: 3600 }); // Cache expiration time set to 1 hour

// exports.getUserData = async (req, res) => {
//   const email = req.params.email;

//   if (!email) {
//     return res.status(400).json({ message: "Email is required" });
//   }

//   try {
//     console.log("Stage 2 T");
//     const cacheKey = `user:${email}`; // Unique cache key for user

//     // Check if user data is in cache
//     const cachedData = cache.get(cacheKey);
//     if (cachedData) {
//       // If cached data exists, return it
//       return res.status(200).json(cachedData);
//     } else {
//       // Fetch from the database if not cached
//       const userSnapshot = await adminDb
//         .collection("users")
//         .where("email", "==", email)
//         .get();

//       if (userSnapshot.empty) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       const userData = userSnapshot.docs[0].data();
//       const payload = {
//         email: email,
//         role: userData.role,
//       };

//       const token = jwt.sign(payload, process.env.JWT_SECRET, {
//         expiresIn: "1h",
//       });

//       // Cache user data and token
//       cache.set(cacheKey, { userData, token });

//       // Send the data back to the frontend
//       res.status(200).json({ userData, token });
//     }
//   } catch (error) {
//     console.log("Stage 2 F");
//     res
//       .status(500)
//       .json({ message: "Failed to fetch user data", error: error.message });
//   }
// };

import { adminDb } from "../config/firebaseConfig.js"; // Ensure to include .js for ES modules
import jwt from "jsonwebtoken";
import NodeCache from "node-cache";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// Create NodeCache instance
const cache = new NodeCache({ stdTTL: 3600 }); // Cache expiration time set to 1 hour

export const getUserData = async (req, res) => {
  const email = req.params.email;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    console.log("Stage 2 T");
    const cacheKey = `user:${email}`; // Unique cache key for user

    // Check if user data is in cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      // If cached data exists, return it
      return res.status(200).json(cachedData);
    } else {
      // Fetch from the database if not cached
      const userSnapshot = await adminDb
        .collection("users")
        .where("email", "==", email)
        .get();

      if (userSnapshot.empty) {
        return res.status(404).json({ message: "User not found" });
      }

      const userData = userSnapshot.docs[0].data();
      const payload = {
        email: email,
        role: userData.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Cache user data and token
      cache.set(cacheKey, { userData, token });

      // Send the data back to the frontend
      res.status(200).json({ userData, token });
    }
  } catch (error) {
    console.log("Stage 2 F");
    res.status(500).json({ message: "Failed to fetch user data", error: error.message });
  }
};
