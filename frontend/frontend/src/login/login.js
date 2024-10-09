// login.js

import React from "react";
import SignIn from "./signin/signin";
import { Paper } from "@mui/material";
import styles from "./login.module.css";

function Login() {
  return (
    <div className={styles.main}>
      <div className={styles.leftPanel}>
        <div className={styles.logo}></div>
        <h1 className={styles.welcomeText}>Welcome Back!</h1>
        <p className={styles.subtitle}>Log in to access your account.</p>
      </div>

      <div className={styles.rightPanel}>
        <Paper
          elevation={8}
          className={`${styles.paper} ${styles.shadowEffect}`}
        >
          <h2 className={styles.formTitle}>Fly Nexus</h2>
          <div className={styles.formContent}>
            <SignIn />
          </div>
        </Paper>
      </div>

      {/* Mobile View */}
      <div className={styles.mobileView}>
        <div className={styles.mobileLogo}></div>
        <h1 className={styles.mobileTitle}>Welcome to LP RAIL PRODUCTS</h1>
        <div className={styles.mobileFormContent}>
          <SignIn />
        </div>
      </div>
    </div>
  );
}

export default Login;
