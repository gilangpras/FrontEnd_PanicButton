/* eslint-disable react/prop-types */
import React, {useState, useEffect} from 'react'
import { Navigate } from 'react-router-dom'
import jwtDecode from 'jwt-decode'

const PrivateRoute = ({ redirectPath, role, children }) => {
  const [roleLogged, setRoleLogged] = useState(null)
  const accessToken = localStorage.getItem('Token')

  useEffect(() => {
    const getRole = async () => {
      if (accessToken) {
        const decodedToken = jwtDecode(accessToken)
        const role = decodedToken.role
        setRoleLogged(role)
      }
    }
    getRole()
  }, [accessToken])

  if (roleLogged && roleLogged !== role) {
    return <Navigate to={redirectPath}/>
  }

  return children
}

export default PrivateRoute