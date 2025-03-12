import React, { createContext, useState, useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export const ThemeContext = createContext();

const ThemeProviderComponent = ({ children }) => {
  // Estado para controlar o tema
  const [darkMode, setDarkMode] = useState(false);

  // Alternar entre temas
  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // Criando o tema dinâmico
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: darkMode ? "#bb86fc" : "#7000b5", // Roxo escuro para claro e lilás para escuro
          },
          background: {
            default: darkMode ? "#121212" : "#f4f4f4", // Fundo escuro ou claro
            paper: darkMode ? "#1e1e1e" : "#ffffff",
          },
          text: {
            primary: darkMode ? "#ffffff" : "#000000",
          },
        },
      }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Aplica o tema globalmente */}
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProviderComponent;
