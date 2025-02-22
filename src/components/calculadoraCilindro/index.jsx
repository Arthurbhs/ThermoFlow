import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

const CylindricalConvection = () => {
  const [deltaT, setDeltaT] = useState("");
  const [length, setLength] = useState(""); // Comprimento do cilindro
  const [radius, setRadius] = useState(""); // Raio externo do cilindro
  const [h, setH] = useState(""); // Coeficiente de convecção
  const [thermalResistance, setThermalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState(0);

  const handleCalculate = () => {
    const L = parseFloat(length);
    const r = parseFloat(radius);
    const hValue = parseFloat(h);
    const dT = parseFloat(deltaT);

    if (isNaN(L) || isNaN(r) || isNaN(hValue) || isNaN(dT) || L <= 0 || r <= 0 || hValue <= 0) {
      alert("Insira valores válidos!");
      return;
    }

    // Área externa do cilindro
    const area = 2 * Math.PI * r * L;

    // Resistência térmica por convecção
    const convResistance = 1 / (hValue * area);

    // Fluxo de calor por convecção
    const q = dT / convResistance;

    setThermalResistance(convResistance);
    setHeatFlux(q);
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "50px auto", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: "#fff", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>Transferência de Calor por Convecção</Typography>

      <TextField
        label="Comprimento do Cilindro (m)"
        type="number"
        value={length}
        onChange={(e) => setLength(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Raio Externo (m)"
        type="number"
        value={radius}
        onChange={(e) => setRadius(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Coeficiente de Convecção (h em W/m².K)"
        type="number"
        value={h}
        onChange={(e) => setH(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Diferença de Temperatura (ΔT em K)"
        type="number"
        value={deltaT}
        onChange={(e) => setDeltaT(e.target.value)}
        fullWidth
        margin="normal"
      />

      <Button
        variant="contained"
        onClick={handleCalculate}
        sx={{
          display: "block",
          margin: "20px auto",
          backgroundColor: "#007BFF",
          "&:hover": { backgroundColor: "#0056b3" },
        }}
      >
        Calcular
      </Button>

      <Box sx={{ marginTop: "20px", padding: "15px", borderRadius: "8px", backgroundColor: "#f4f4f4" }}>
        <Typography variant="h6">Resultados</Typography>
        <TextField
          label="Resistência Térmica Convectiva (m².K/W)"
          value={thermalResistance.toFixed(6)}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Fluxo de Calor (Q) em Watts"
          value={heatFlux.toFixed(2)}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />
      </Box>
    </Box>
  );
};

export default CylindricalConvection;
