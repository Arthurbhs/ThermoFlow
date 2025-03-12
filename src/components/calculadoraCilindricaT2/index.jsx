import React, { useState } from "react";
import { Box, TextField, Button, Typography, useTheme, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const CylindricalConvection = () => {
  const theme = useTheme();
  const [deltaT, setDeltaT] = useState("");
  const [layers, setLayers] = useState([{ length: "", radius: "", h: "" }]);
  const [length, setLength] = useState("");
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState(0);

  // Permite apenas números e um único ponto decimal, incluindo negativos
  const handleNumericInput = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };
  
  const handleLayerChange = (index, field, value) => {
    if (/^-?\d*\.?\d*$/.test(value)) {
      setLayers((prevLayers) =>
        prevLayers.map((layer, i) =>
          i === index ? { ...layer, [field]: value } : layer
        )
      );
    }
  };
  
  const addLayer = () => {
    setLayers([...layers, { length: "", radius: "", h: "" }]);
  };

  const removeLayer = (index) => {
    setLayers(layers.filter((_, i) => i !== index));
  };

  const handleCalculate = () => {
    if (!deltaT || layers.some(layer => !layer.length || !layer.radius || !layer.h)) return;

    let totalRes = 0;
    layers.forEach((layer) => {
      const L = parseFloat(layer.length);
      const r = parseFloat(layer.radius);
      const hValue = parseFloat(layer.h);
      
      if (!isNaN(L) && !isNaN(r) && !isNaN(hValue) && L > 0 && r > 0 && hValue > 0) {
        const area = 2 * Math.PI * r * L;
        totalRes += 1 / (hValue * area);
      }
    });

    setTotalResistance(totalRes);
    setHeatFlux(totalRes > 0 ? (parseFloat(deltaT) / totalRes).toFixed(2) : "0.00");
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "50px auto", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      backgroundColor: theme.palette.background.paper, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>Transferência de Calor em Estruturas Cilíndricas</Typography>

      <TextField
        label="Diferença de Temperatura (ΔT em K)"
        value={deltaT}
        onChange={(e) => handleNumericInput(e.target.value, setDeltaT)}
        fullWidth
        margin="normal"
      />

      <Typography variant="h6" gutterBottom>Camadas</Typography>
      {layers.map((layer, index) => (
        <Box key={index} sx={{ marginBottom: "15px", textAlign: "center" }}>
          <TextField
            label="Comprimento do Cilindro (m)"
            value={layer.length}
            onChange={(e) => handleLayerChange(index, "length", e.target.value)}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Raio Externo (m)"
            value={layer.radius}
            onChange={(e) => handleLayerChange(index, "radius", e.target.value)}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Coeficiente de Convecção (h em W/m².K)"
            value={layer.h}
            onChange={(e) => handleLayerChange(index, "h", e.target.value)}
            fullWidth
            margin="normal"
          />
          <IconButton onClick={() => removeLayer(index)} sx={{ color: "#9b00d9" }}>
            <RemoveCircleIcon />
          </IconButton>
        </Box>
      ))}

      <Button
        variant="outlined"
        onClick={addLayer}
        startIcon={<AddCircleIcon />}
        sx={{ marginBottom: "20px", color: "#7300ff", borderColor: "#7300ff", "&:hover": { backgroundColor: "#7300ff", color: "white" } }}
      >
        Adicionar Camada
      </Button>

      <Button
        variant="contained"
        onClick={handleCalculate}
        disabled={!deltaT || layers.some(layer => !layer.length || !layer.radius || !layer.h)}
        sx={{
          display: "block",
          margin: "10px auto",
          backgroundColor: "#007BFF",
          "&:hover": { backgroundColor: "#0056b3" },
        }}
      >
        Calcular
      </Button>

      <Box sx={{ marginTop: "20px", padding: "15px", borderRadius: "8px", backgroundColor: theme.palette.background.paper }}>
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
    </Box>
  );
};

export default CylindricalConvection;
