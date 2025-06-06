import React, { useState } from "react";
import { Box, Typography, TextField, InputAdornment, IconButton, Popover } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const ResultBox = ({ totalResistance, heatFlux }) => {
  const [anchorElResistance, setAnchorElResistance] = useState(null);
  const [anchorElFlux, setAnchorElFlux] = useState(null);

  const handleOpenResistance = (event) => {
    setAnchorElResistance(event.currentTarget);
  };

  const handleCloseResistance = () => {
    setAnchorElResistance(null);
  };

  const handleOpenFlux = (event) => {
    setAnchorElFlux(event.currentTarget);
  };

  const handleCloseFlux = () => {
    setAnchorElFlux(null);
  };

  const openResistance = Boolean(anchorElResistance);
  const openFlux = Boolean(anchorElFlux);

  return (
    <Box sx={{ marginTop: "20px", padding: "15px", borderRadius: "8px", backgroundColor: "background.paper" }}>
      <Typography variant="h6">Resultados</Typography>

      <TextField
        label="Resistência Térmica Total (K/W)"
        value={totalResistance.toFixed(6)}
        fullWidth
        margin="normal"
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleOpenResistance} edge="end" size="small">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Popover
        open={openResistance}
        anchorEl={anchorElResistance}
        onClose={handleCloseResistance}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        disableRestoreFocus
      >
        <Typography sx={{ p: 2, maxWidth: 300, fontSize: 14 }}>
         é a oposição ao fluxo de calor através de um material ou conjunto de materiais, expressa em Kelvin por Watt (K/W).
        </Typography>
      </Popover>

      <TextField
        label="Fluxo de Calor (Q) em Watts"
        value={heatFlux}
        fullWidth
        margin="normal"
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleOpenFlux} edge="end" size="small">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Popover
        open={openFlux}
        anchorEl={anchorElFlux}
        onClose={handleCloseFlux}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        disableRestoreFocus
      >
        <Typography sx={{ p: 2, maxWidth: 300, fontSize: 14 }}>
         quantidade de energia térmica transferida por unidade de tempo, medida em Watts (W).
        </Typography>
      </Popover>
    </Box>
  );
};

export default ResultBox;
