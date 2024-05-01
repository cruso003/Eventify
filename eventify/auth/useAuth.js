import { useContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

import AuthContext from "./context";
import authStorage from "./storage";
import { useCart } from "../components/context/CartContext";

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);
  const { cart, setCart } = useCart();

  const logIn = (authToken) => {
    const decodedToken = jwtDecode(authToken);
    setUser(decodedToken);
    authStorage.storeToken(authToken);
  };

  const logOut = () => {
    setCart([]);
    setUser(null);
    authStorage.removeToken();
  };

  return { user, logIn, logOut, cart };
};

export default useAuth;
