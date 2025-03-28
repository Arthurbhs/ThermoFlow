import React from "react";
import { Box, Typography, TextField } from "@mui/material";

const ResultBox = ({ totalResistance, heatFlux }) => {
  return (
    <Box sx={{ marginTop: "20px", padding: "15px", borderRadius: "8px", backgroundColor: "background.paper" }}>
      <Typography variant="h6">Resultados</Typography>
      <TextField
        label="Resistência Térmica Total (K/W)"
        value={totalResistance.toFixed(6)}
        fullWidth
        margin="normal"
        InputProps={{ readOnly: true }}
      />
      <TextField
        label="Fluxo de Calor (Q) em Watts"
        value={heatFlux}
        fullWidth
        margin="normal"
        InputProps={{ readOnly: true }}
      />
    </Box>
  );
};

export default ResultBox;
