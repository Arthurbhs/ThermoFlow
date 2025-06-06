import React, { useContext, useState } from "react";
import { AppBar, Toolbar, IconButton, Box, MenuItem, Switch, Drawer, Button, Typography } from "@mui/material";
import { Menu as MenuIcon, Brightness4, Brightness7, ExpandMore, ExpandLess } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../AuthContext";
import Logo from "../../assets/logo.png";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showEstudos, setShowEstudos] = useState(false);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useAuth();

  const loginColor = darkMode ? "#c38fff" : "#7000b5";
  const logoutColor = darkMode ? "#ff8080" : "red";
  const logoutHover = darkMode ? "rgba(255,128,128,0.1)" : "rgba(255,0,0,0.1)";
  const loginHover = darkMode ? "rgba(195, 143, 255, 0.1)" : "rgba(112, 0, 181, 0.1)";

  return (
    <AppBar position="static" sx={{ backgroundColor: "#7000b5", height: "75px" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", marginTop: "15px" }}>
          <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
          <img
            src={Logo}
            alt="Logo"
            style={{ maxHeight: "60px", padding: "2px", width: "auto", objectFit: "contain" }}
          />
        </Box>
      </Toolbar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: darkMode ? "#333" : "#fff",
            color: darkMode ? "white" : "black",
            width: 250,
          },
        }}
      >
        <Box
          sx={{
            padding: "20px",
            backgroundColor: "#7000b5",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <img
            src={Logo}
            alt="Logo"
            style={{ maxHeight: "60px", width: "auto", objectFit: "contain" }}
          />
        </Box>

        {/* Saudação ou Login */}
        <Box sx={{ textAlign: "center", mb: 2, mx: 1 }}>
          {user ? (
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Olá, {user.displayName || user.email}
            </Typography>
          ) : (
            <Typography variant="body2">
              🔒 Faça{" "}
              <span
                style={{
                  color: loginColor,
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  setDrawerOpen(false);
                  window.location.href = "/login";
                }}
                onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
                onMouseOut={(e) => (e.target.style.textDecoration = "none")}
              >
                Login
              </span>
              {" "} e melhore sua experiência
            </Typography>
          )}
        </Box>

        {/* Menu principal */}
        <MenuItem onClick={() => setDrawerOpen(false)} component={Link} to="/Calculadora">
          Calculadora
        </MenuItem>

        <MenuItem onClick={() => setShowEstudos(!showEstudos)}>
          Estudos {showEstudos ? <ExpandLess /> : <ExpandMore />}
        </MenuItem>

        {showEstudos && (
          <Box sx={{ ml: 2 }}>
            <Button
              fullWidth
              sx={{ justifyContent: "flex-start", color: darkMode ? "white" : "black" }}
              component={Link}
              to="/estudos_pag1"
              onClick={() => setDrawerOpen(false)}
            >
              A lei de Fourier
            </Button>
            <Button
              fullWidth
              sx={{ justifyContent: "flex-start", color: darkMode ? "white" : "black" }}
              component={Link}
              to="/estudos_pag2"
              onClick={() => setDrawerOpen(false)}
            >
              Condução
            </Button>
            <Button
              fullWidth
              sx={{ justifyContent: "flex-start", color: darkMode ? "white" : "black" }}
              component={Link}
              to="/estudos_pag3"
              onClick={() => setDrawerOpen(false)}
            >
              Convecção
            </Button>
          </Box>
        )}

        <MenuItem onClick={() => setDrawerOpen(false)} component={Link} to="/Materiais">
          Materiais
        </MenuItem>

        {/* Botão de tema */}
        <Box sx={{ display: "flex", alignItems: "center", marginTop: 2, ml: 2 }}>
          {darkMode ? <Brightness4 sx={{ mr: 2 }} /> : <Brightness7 sx={{ mr: 2 }} />}
          <Switch checked={darkMode} onChange={toggleTheme} />
        </Box>

        {/* Logout */}
       {user && (
  <Button
    fullWidth
    sx={{
      justifyContent: "flex-start",
      color: logoutColor,
      fontSize: "0.7rem",
      mt: 1,
      px: 2,
      "&:hover": {
        backgroundColor: logoutHover,
      },
    }}
    onClick={() => {
      logout();
      setDrawerOpen(false);
      window.location.href = "/";
    }}
  >
    🔓 Logout
  </Button>
)}

      </Drawer>
    </AppBar>
  );
};

export default Header;
