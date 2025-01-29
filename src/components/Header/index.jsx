import React from "react";
import { AppBar, Toolbar, IconButton, Box, Menu, MenuItem } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";  // Certifique-se de que o caminho da logo está correto.

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
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#7000b5" }}>
      <Toolbar>
        {/* Logo */}
        <Box sx={{ flexGrow: 1 }}>
            <img
              src={Logo}
              alt="Logo"
              style={{ maxHeight: "60px", padding: "7px", width: "auto", objectFit: "contain" }}
            />
       
        </Box>

        {/* Links (para telas grandes) */}
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <StyledLink to="/Calculadora">calcular</StyledLink>
          <StyledLink to="/Historia">Sobre</StyledLink>
        </Box>

        {/* Ícone de menu (para telas pequenas) */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            keepMounted
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <MenuItem onClick={handleMenuClose} component={Link} to="/Calculadora">
              Calcular
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/Historia">
              Sobre
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
