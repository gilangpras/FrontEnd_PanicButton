// /* eslint-disable react/prop-types */
// import React from 'react'
// import { Outlet, Navigate } from 'react-router-dom'

// const RequireAuth = ({ redirectPath }) => {
//   const isAuthenticated = localStorage.getItem('accessToken')

//   if (!isAuthenticated) {
//     return <Navigate to={redirectPath} />
//   }

//   return (
//     <Outlet/>
//   )
// }

// export default RequireAuth