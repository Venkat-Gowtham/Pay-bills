import React, { useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Menu, MenuItem, Box, Typography } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";
import { DataContext } from "../../context/dataprovider.js"; // Import DataContext
const Navbar = () => {
  const { userData } = useContext(DataContext); // Consume userData from context
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const  IMAGE_URL = process.env.REACT_APP_MAIN_API;
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    localStorage.clear();
    navigate("/");
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static" className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <Box
            className={
              isMobile ? styles.mobileLogoContainer : styles.logoContainer
            }
          >
            <Link to="/" className={styles.link}>
              <img
                src={`${IMAGE_URL}/images/Logo.png`}
                alt="Logo"
                className={styles.logo}
              />
              <Typography variant="h6" className={styles.logoText}>
                LP RAIL PRODUCTS
              </Typography>
            </Link>
          </Box>

          {isMobile ? (
            <Box className={styles.mobileGreetingContainer}>
              <Typography className={styles.greetingMobile}>
                {`Welcome, ${userData.name}`}
              </Typography>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <AccountCircleIcon />
              </IconButton>
            </Box>
          ) : (
            <Box className={styles.menuAndIcons}>
              <Typography className={styles.greeting}>
                {`Welcome, ${userData.name}`}
              </Typography>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <AccountCircleIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Menu for User Icon */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>{userData.email}</MenuItem>
        <MenuItem onClick={handleMenuClose}>{userData.role}</MenuItem>
        <MenuItem onClick={handleLogin}>Log Out</MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
