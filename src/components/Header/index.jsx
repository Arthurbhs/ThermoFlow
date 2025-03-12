import React, { useContext, useState } from "react";
import { AppBar, Toolbar, IconButton, Box, MenuItem, Switch, Typography, Drawer } from "@mui/material";
import { Menu as MenuIcon, Brightness4, Brightness7 } from "@mui/icons-material";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext"; // Importando o contexto de tema
import Logo from "../../assets/logo.png";

const StyledLink = styled(Link)({
  textDecoration: "none",
  color: "white",
  marginLeft: "20px",
  fontFamily: "'Poppins', sans-serif",
  fontSize: "16px",
  "&:hover": {
    color: "#d890d3",
  },
});

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false); // Estado para controlar a abertura do Drawer
  const { darkMode, toggleTheme } = useContext(ThemeContext); // Obtendo estado do tema

  const handleMenuOpen = () => {
    setDrawerOpen(true); // Abre o Drawer
  };

  const handleMenuClose = () => {
    setDrawerOpen(false); // Fecha o Drawer
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#7000b5" }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        {/* Logo à esquerda */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
        </Box>

          <img
            src={Logo}
            alt="Logo"
            style={{ maxHeight: "60px", padding: "7px", width: "auto", objectFit: "contain" }}
          />
        </Box>


    
      </Toolbar>

      {/* Drawer (menu deslizante) */}
      <Drawer
        anchor="left" // Define que o menu vai aparecer do lado esquerdo
        open={drawerOpen}
        onClose={handleMenuClose}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: darkMode ? "#333" : "#fff", // Cor do Drawer depende do tema
            color: darkMode ? "white" : "black", // Cor do texto no Drawer
            width: 250, // Largura do Drawer
          },
        }}
      >
        {/* Box com a logo dentro do Drawer, com a cor fixa */}
        <Box sx={{ 
          padding: "20px", 
          backgroundColor: "#7000b5", // Cor fixa para a Box com a logo
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          marginBottom: "20px"
        }}>
          <img
            src={Logo}
            alt="Logo"
            style={{ maxHeight: "60px", width: "auto", objectFit: "contain" }}
          />
        </Box>

        {/* Links dentro do Drawer */}
        <MenuItem onClick={handleMenuClose} component={Link} to="/Calculadora">
          Calcular
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to="/Historia">
          Sobre
        </MenuItem>

        {/* Alternância de tema dentro do menu deslizante */}
        <Box sx={{ display: "flex", alignItems: "center", marginTop: 2, ml: 2 }}>
          {/* Alterando ícone de acordo com o tema */}
          {darkMode ? (
            <Brightness4 sx={{ mr: 2 }} /> // Ícone de lua (modo escuro)
          ) : (
            <Brightness7 sx={{ mr: 2 }} /> // Ícone de sol (modo claro)
          )}
          <Switch checked={darkMode} onChange={toggleTheme} />
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
