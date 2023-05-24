import React from "react"
import PrivateRoute from './privateRoute'
import RequireAuth from './requireAuth'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { LandingPage, AboutPage, LoginPage, RegisterPage, HomeUserPanicButton, EditProfile, UnauthorizedPage, HomeAdmin, HomeUser } from "../view";

const Routers = () => {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/tentangkami" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/noaccess" element={<UnauthorizedPage />} />
        <Route path="/nexthomeuser" element={<HomeUser />} />

        {/* Parent Routes Auth Requirement */}
        <Route element={<RequireAuth redirectPath='/login' />}>

        {/* Private Routes Admin */}
        <Route
            path='/admin'
            element={
              <PrivateRoute
                redirectPath='/noaccess'
                role='admin'
              >
                <HomeAdmin />
              </PrivateRoute>
            }
          />

          {/* Private Routes User */}
          <Route
            path='/home'
            element={
              <PrivateRoute
                redirectPath='/noaccess'
                role='user'>
                <HomeUserPanicButton />
              </PrivateRoute>
            }
          />

          <Route
            path='/editprofile'
            element={
              <PrivateRoute
                redirectPath='/noaccess'
                role='user'>
                <EditProfile />
              </PrivateRoute>
            }
          />

        </Route>
      </Routes>
    </Router>
  );
}
export default Routers