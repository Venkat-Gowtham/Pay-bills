// DashBoard.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./navbar/navbar";
import About from "./about/about";
import Contact from "./contact/contact";
import Home from "./home/home";
import ProtectedRoute from "../Protector/RouteProtector"; // Import the ProtectedRoute component
import style from "./dashboard.module.css";

function DashBoard() {
  return (
    <>
      <div className={style.navbar}>
        <NavBar />
      </div>
      <div className={style.pageContent}>
        <Routes>
          {/* Protect routes that need authentication */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default DashBoard;
