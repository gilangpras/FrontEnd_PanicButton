/* eslint-disable react/prop-types */
import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import AlertComponent from "../components/alert"
import { getToken } from "../helper";

const RequireAuth = ({ redirectPath }) => {

  const isAuthenticated = false

  if (!isAuthenticated && getToken()==null) {
    AlertComponent.Warning("Mohon Login Terlebih Dahulu !")
    return <Navigate to={redirectPath} />
  }
  return (
    <Outlet/>
  )
}

export default RequireAuth