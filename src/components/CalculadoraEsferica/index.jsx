import React, { useState } from "react";
import { Box, TextField, Button, Typography, IconButton, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const materials = [
  { name: "Selecione um material", value: "" },
  { name: "Cobre", value: 385 },
  { name: "Alumínio", value: 205 },
  { name: "Ferro", value: 80 },
  { name: "Aço Inoxidável", value: 15 },
  { name: "Madeira", value: 0.15 },
  { name: "Isopor", value: 0.035 },
  { name: "Lã de Vidro", value: 0.04 },
  { name: "Concreto", value: 1.4 },
];

const SphericalHeatTransfer = () => {
  const [layers, setLayers] = useState([{ k: "", r1: "", r2: "", material: "" }]);
  const [deltaT, setDeltaT] = useState("");

  const handleLayerChange = (index, field, value) => {
    const updatedLayers = [...layers];
    updatedLayers[index][field] = value;
    setLayers(updatedLayers);
  };

  const handleMaterialChange = (index, value) => {
    const selectedMaterial = materials.find((mat) => mat.name === value);
    if (selectedMaterial) {
      handleLayerChange(index, "k", selectedMaterial.value);
      handleLayerChange(index, "material", value);
    }
  };

  const addLayer = () => {
    setLayers([...layers, { k: "", r1: "", r2: "", material: "" }]);
  };

  const removeLayer = (index) => {
    setLayers(layers.filter((_, i) => i !== index));
  };

  const calculateResults = () => {
    let totalResistance = 0;
    layers.forEach((layer) => {
      const k = parseFloat(layer.k);
      const r1 = parseFloat(layer.r1);
      const r2 = parseFloat(layer.r2);

      if (k > 0 && r1 > 0 && r2 > r1) {
        totalResistance += (1 / (4 * Math.PI * k)) * ((1 / r1) - (1 / r2));
      }
    });

    if (totalResistance === 0 || isNaN(totalResistance)) {
      return { u: "0.00", q: "0.00" };
    }

    const u = 1 / totalResistance;
    const q = u * parseFloat(deltaT || 0);
    return { u: u.toFixed(2), q: q.toFixed(2) };
  };

  const results = calculateResults();

  return (
    <Box sx={{ maxWidth: 600, margin: "50px auto", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: "#fff", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Transferência de Calor em Estruturas Esféricas
      </Typography>

      <TextField label="Diferença de Temperatura (ΔT em K)" type="number" value={deltaT} onChange={(e) => setDeltaT(e.target.value)} fullWidth margin="normal" />

      <Typography variant="h6" gutterBottom>
        Camadas
      </Typography>
      {layers.map((layer, index) => (
        <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <FormControl fullWidth>
            <InputLabel>Material</InputLabel>
            <Select value={layer.material} onChange={(e) => handleMaterialChange(index, e.target.value)}>
              {materials.map((mat, i) => (
                <MenuItem key={i} value={mat.name}>{mat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField label="Raio Interno (m)" type="number" value={layer.r1} onChange={(e) => handleLayerChange(index, "r1", e.target.value)} fullWidth />
          <TextField label="Raio Externo (m)" type="number" value={layer.r2} onChange={(e) => handleLayerChange(index, "r2", e.target.value)} fullWidth />
          <IconButton onClick={() => removeLayer(index)} sx={{ color: "#9b00d9" }}>
            <RemoveCircleIcon />
          </IconButton>
        </Box>
      ))}

      <Button variant="outlined" onClick={addLayer} startIcon={<AddCircleIcon />} sx={{ marginBottom: "20px", color: "#7300ff", borderColor: "#7300ff", "&:hover": { backgroundColor: "#7300ff", color: "white" } }}>
        Adicionar Camada
      </Button>

      <Box>
        <Typography variant="h6">Resultados</Typography>
        <Typography>Coeficiente de Transferência de Calor (U): {results.u} W/m².K</Typography>
        <Typography>Taxa de Transferência de Calor (Q): {results.q} W</Typography>
      </Box>
    </Box>
  );
};

export default SphericalHeatTransfer;
