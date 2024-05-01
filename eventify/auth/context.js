import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Check if user is already logged in
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        const data = await AsyncStorage.getItem("isLoggedIn");
        if (data !== null) {
          setIsLoggedIn(true);
        }
        if (userData !== null) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error retrieving user data: ", error);
        // Handle AsyncStorage retrieval error
      }
    };
    getUserData();
  }, []);

  const login = (userData) => {
    setUser(userData);
    //Save user data to local storage
    AsyncStorage.setItem("userData", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    //Clear user data from local storage
    AsyncStorage.removeItem("userData");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
