import React, { createContext, useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export const ThemeContext = createContext();

const ThemeProviderComponent = ({ children }) => {
  // Inicializa o tema com base no localStorage ou padrão claro
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Atualiza o localStorage quando o tema muda
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

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
            main: darkMode ? "#bb86fc" : "#7000b5",
          },
          background: {
            default: darkMode ? "#121212" : "#f4f4f4",
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
