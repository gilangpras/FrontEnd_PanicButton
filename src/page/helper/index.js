import jwtDecode from "jwt-decode";

export function authHeader() {
  const token = localStorage.getItem("Token");
  if (token !== null) {
    return { "x-access-token": token };
  } else {
    return {};
  }
}

export function getToken() {
  const token = localStorage.getItem("Token");
  if (token !== null) {
    return token;
  } else {
    return token;
  }
}

export function authHeaderStatic() {
  return {
    "access-token":
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  };
}

export function getGuid() {
  const token = localStorage.getItem("Token");
  
  if (token !== null) {
    const decoded = jwtDecode(token);
    return decoded.guid;
  } else {
    return null;
  }
}

export function getRole() {
  const token = localStorage.getItem("Token");
  const decoded = jwtDecode(token);
  if (token !== null) {
    return decoded.role;
  } else {
    return null;
  }
}

