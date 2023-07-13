import React from "react"
import PrivateRoute from './privateRoute'
import RequireAuth from './requireAuth'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 
  { 
    LandingPage, 
    AboutPage, 
    LoginPage, 
    RegisterPage, 
    HomeUserPanicButton, 
    EditProfile, 
    UnauthorizedPage, 
    HomeUser, 
    EditProfileUser, 
    HistoryAdmin,
    HistoryUser, 
     } from "../view";

const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/tentangkami" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/noaccess" element={<UnauthorizedPage />} />

        {/* Parent Routes Auth Requirement */}
        <Route element={<RequireAuth redirectPath='/login' />}>

        {/* Private Routes Admin */}
        <Route
            path='/home'
            element={
              <PrivateRoute
                redirectPath='/noaccess'
                role='admin'
              >
                <HomeUserPanicButton />
              </PrivateRoute>
            }
          />

        <Route
            path='/editprofile'
            element={
              <PrivateRoute
                redirectPath='/noaccess'
                role='admin'>
                <EditProfile />
              </PrivateRoute>
            }
          />

        <Route
            path='/historyadmin'
            element={
              <PrivateRoute
                redirectPath='/noaccess'
                role='admin'>
                <HistoryAdmin />
              </PrivateRoute>
            }
          />

          {/* Private Routes User */}
          <Route
            path='/homeuser'
            element={
              <PrivateRoute
                redirectPath='/noaccess'
                role='user'>
                <HomeUser />
              </PrivateRoute>
            }
          />

          <Route
            path='/editprofileuser'
            element={
              <PrivateRoute
                redirectPath='/noaccess'
                role='user'>
                <EditProfileUser />
              </PrivateRoute>
            }
          />

          <Route
            path='/historyuser'
            element={
              <PrivateRoute
                redirectPath='/noaccess'
                role='user'>
                <HistoryUser />
              </PrivateRoute>
            }
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default Routers