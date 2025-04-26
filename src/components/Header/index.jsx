import React, { useContext, useState } from "react";
import { AppBar, Toolbar, IconButton, Box, MenuItem, Switch, Drawer } from "@mui/material";
import { Menu as MenuIcon, Brightness4, Brightness7 } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import Logo from "../../assets/logo.png";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#7000b5" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Box>

        <img
          src={Logo}
          alt="Logo"
          style={{ maxHeight: "60px", padding: "7px", width: "auto", objectFit: "contain" }}
        />
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

        <MenuItem onClick={() => setDrawerOpen(false)} component={Link} to="/Calculadora">
          Calcular
        </MenuItem>
        <MenuItem onClick={() => setDrawerOpen(false)} component={Link} to="/Historia">
          Sobre
        </MenuItem>
        <MenuItem onClick={() => setDrawerOpen(false)} component={Link} to="/Materiais">
          Materiais
        </MenuItem>

        <Box sx={{ display: "flex", alignItems: "center", marginTop: 2, ml: 2 }}>
          {darkMode ? <Brightness4 sx={{ mr: 2 }} /> : <Brightness7 sx={{ mr: 2 }} />}
          <Switch checked={darkMode} onChange={toggleTheme} />
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
