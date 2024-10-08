const NodeCache = require("node-cache");
const jwt = require("jsonwebtoken");
const { adminDb } = require("./src/config/firebaseConfig");
require("dotenv").config();

// Create NodeCache instance
const cache = new NodeCache({ stdTTL: 3600 }); // Cache expiration time set to 1 hour

const authenticateJWT = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(
      token.split(" ")[1],
      process.env.JWT_SECRET,
      async (err, decodedToken) => {
        if (err) {
          return res.sendStatus(403);
        }

        const email = decodedToken.email;
        const cacheKey = `user:${email}`; // Unique key for each user

        // Check NodeCache for cached user data
        const cachedUserData = cache.get(cacheKey);
        console.log(`cachedUserData ${cachedUserData}`);

        if (cachedUserData) {
          // If user data is found in cache, use it
          console.log(`Layer Chache check`);

          req.user = {
            role: cachedUserData.role,
            projectId: cachedUserData.projectId,
          };
          return next();
        } else {
          // If user data not found in cache, fetch from database
          console.log(`Layer DataBase Check`);

          const userSnapshot = await adminDb
            .collection("users")
            .where("email", "==", email)
            .get();

          if (userSnapshot.empty) {
            return res
              .status(404)
              .json({ message: "from layer User not found" });
          }

          const userData = userSnapshot.docs[0].data();

          // Compare role from token and backend, reject if mismatch
          if (userData.role !== decodedToken.role) {
            return res
              .status(403)
              .json({ message: "from layer Role mismatch detected" });
          }

          // Cache the user data for future requests
          cache.set(cacheKey, {
            email: email,
            role: userData.role,
            projectId: userData.projectId,
          });

          // Attach user info to the request
          req.user = {
            email: email,
            role: userData.role,
            projectId: userData.projectId,
          };

          next();
        }
      }
    );
  } else {
    res.sendStatus(401);
  }
};

module.exports = { authenticateJWT };
