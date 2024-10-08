const { signInWithEmailAndPassword } = require("firebase/auth");
const { auth } = require("../config/firebaseConfig");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("stage 1 T");

    res.status(200).json({
      message: "User signed in successfully",
      uid: user.uid,
      email: user.email,
    });
  } catch (error) {
    console.log("stage 1 F");

    res.status(400).json({
      message: "Error signing in",
      error: error.message,
    });
  }
};
