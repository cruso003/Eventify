// AuthProvider.js

import React, { useState, useEffect } from "react";

import axios from "axios";
import AuthContext from "../components/context/AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check user authentication status on component mount
    checkAuthStatus();
  }, []);

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post(`${server}/user/login-user`, {
        email,
        password,
      });

      const userData = response.data.user;
      setUser(userData);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logoutUser = async () => {
    try {
      await axios.get(`${server}/user/logout`);
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${server}/user/getuser`);
      const userData = response.data.user;
      setUser(userData);
    } catch (error) {
      console.log("Not authenticated", error);
    }
  };

  const authContextValue = {
    user,
    loginUser,
    logoutUser,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
