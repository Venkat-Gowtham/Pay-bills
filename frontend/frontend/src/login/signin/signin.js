import React, { useContext } from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import styles from "./sign.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DataContext } from "../../context/dataprovider"; // Import the context
const AUTH_API = process.env.REACT_APP_AUTH_API;
function SignIn() {
  const navigate = useNavigate();
  const { fetchData } = useContext(DataContext); // Use the context

  const [data, setData] = React.useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = data;
    console.log(data);
    if (email !== "" && password !== "") {
      console.log(AUTH_API);
      try {
        const response = await axios.post(
          "http://localhost:8080/api/auth/login",
          { email, password }
        );
        const { email: userEmail } = response.data; // Getting email from response

        // Save user info to local storage
        localStorage.setItem("clientId", userEmail);

        // Fetch user data using the email from the response
        await fetchData(userEmail);

        // Navigate to the request form or dashboard after successful sign-in
        navigate("/dashboard");
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Please fill in the details");
    }
  };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <Typography variant="h6">Sign In</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              id="email"
              name="email"
              label="Email"
              variant="outlined"
              fullWidth
              value={data.email}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={data.password}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              endIcon={<SendIcon />}
            >
              Sign In
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default SignIn;
