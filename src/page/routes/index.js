import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LandingPage, AboutPage, LoginPage, RegisterPage, HomeUserPanicButton } from "../view";

const Routers = () => {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/tentangkami" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/homeuser" element={<HomeUserPanicButton />} />

      </Routes>
    </Router>
  );
}

export default Routers