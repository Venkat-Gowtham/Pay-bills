import React from "react";
import "./App.css";
import Login from "./login/login.js";
import Dashboard from "./pages/dashboard.js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DataProvider } from "./context/dataprovider.js"; // Import your DataProvider
import FormComponent from "./Practice/SaveToExel.js";
// import Loader from "./loader/loader";
function App() {
  return (
    // Wrap your entire app with DataProvider to make the context available
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            index
            path="/dashboard"
            element={
              // <RequireAuth>
              <Dashboard />
              // </RequireAuth>
            }
          />
          <Route path="/excel" element={<FormComponent />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
