import React, { useState } from "react";
import { Box, TextField, Button, Typography, IconButton, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const SphericalConvectionCalculator = () => {
  const [layers, setLayers] = useState([{ h: "", r: "" }]);
  const [deltaT, setDeltaT] = useState("");
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState("0.00");

  const handleNumericInput = (value, setter) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  const handleLayerChange = (index, field, value) => {
    if (/^\d*\.?\d*$/.test(value)) {
      const updatedLayers = [...layers];
      updatedLayers[index][field] = value;
      setLayers(updatedLayers);
    }
  };

  const addLayer = () => {
    setLayers([...layers, { h: "", r: "" }]);
  };

  const removeLayer = (index) => {
    const updatedLayers = layers.filter((_, i) => i !== index);
    setLayers(updatedLayers);
  };

  const calculateResistance = () => {
    let totalResistance = 0;
    layers.forEach((layer) => {
      const h = parseFloat(layer.h);
      const r = parseFloat(layer.r);

      if (!isNaN(h) && !isNaN(r) && h > 0 && r > 0) {
        const area = 4 * Math.PI * r ** 2;
        totalResistance += 1 / (h * area);
      }
    });
    setTotalResistance(totalResistance);
  };

  const calculateHeatFlux = () => {
    if (totalResistance > 0) {
      const q = parseFloat(deltaT || 0) / totalResistance;
      setHeatFlux(q.toFixed(2));
    } else {
      setHeatFlux("0.00");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "50px auto", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: "#fff", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Transferência de Calor  em Estruturas Esféricas
      </Typography>

      <TextField
        label="Diferença de Temperatura (ΔT em K)"
        value={deltaT}
        onChange={(e) => handleNumericInput(e.target.value, setDeltaT)}
        fullWidth
        margin="normal"
      />

      <Typography variant="h6" gutterBottom>
        Camadas de Convecção
      </Typography>
      {layers.map((layer, index) => (
        <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <TextField
            label="Coeficiente de Convecção (h em W/m².K)"
            value={layer.h}
            onChange={(e) => handleLayerChange(index, "h", e.target.value)}
            fullWidth
          />
          <TextField
            label="Raio da Superfície Externa (m)"
            value={layer.r}
            onChange={(e) => handleLayerChange(index, "r", e.target.value)}
            fullWidth
          />
          <IconButton onClick={() => removeLayer(index)} sx={{ color: "#9b00d9" }}>
            <RemoveCircleIcon />
          </IconButton>
        </Box>
      ))}

      <Button variant="outlined" onClick={addLayer} startIcon={<AddCircleIcon />} sx={{ marginBottom: "20px", color: "#7300ff", borderColor: "#7300ff", "&:hover": { backgroundColor: "#7300ff", color: "white" } }}>
        Adicionar Camada
      </Button>

      <Button
        variant="contained"
        onClick={() => {
          calculateResistance();
          calculateHeatFlux();
        }}
        sx={{
          display: "block",
          margin: "10px auto",
          backgroundColor: "#007BFF",
          "&:hover": { backgroundColor: "#0056b3" },
        }}
      >
        Calcular
      </Button>

      <Box sx={{ marginTop: "20px", padding: "15px", borderRadius: "8px", backgroundColor: "#f4f4f4" }}>
        <Typography variant="h6">Resultados</Typography>
        <TextField label="Resistência Térmica Total (K/W)" value={totalResistance.toFixed(6)} fullWidth margin="normal" InputProps={{ readOnly: true }} />
        <TextField label="Fluxo de Calor (Q) em Watts" value={heatFlux} fullWidth margin="normal" InputProps={{ readOnly: true }} />
      </Box>
    </Box>
  );
};

export default SphericalConvectionCalculator;
