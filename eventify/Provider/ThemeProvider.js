import React, { createContext, useState, useEffect } from "react";
import { Appearance, AppearanceProvider } from "react-native-appearance";
import lightTheme from "../constants/lightTheme";
import darkTheme from "../constants/darkTheme";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const themeStyles = theme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={themeStyles}>
      {children}
    </ThemeContext.Provider>
  );
};
