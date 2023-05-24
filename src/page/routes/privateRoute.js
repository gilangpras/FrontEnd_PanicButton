/* eslint-disable react/prop-types */
import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ redirectPath, role, children }) => {
  const roleLogged = 'user'

  if (roleLogged !== role) {
    return <Navigate to={redirectPath}/>
  }

  return children
}

export default PrivateRoute