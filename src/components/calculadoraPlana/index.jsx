import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, IconButton, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import HeatTransferChart from "../grafico";

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

const HeatTransferCalculator = () => {
  const [layers, setLayers] = useState([{ k: "", l: "", a: 1, material: "" }]);
  const [deltaT, setDeltaT] = useState("");
  const [area, setArea] = useState(1);
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState("0.00");

  useEffect(() => {
    setLayers((prevLayers) => prevLayers.map((layer) => ({ ...layer, a: area })));
  }, [area]);

  const handleLayerChange = (index, field, value) => {
    const numericValue = parseFloat(value);
    if (numericValue < 0) return; // Bloqueia valores negativos
  
    const updatedLayers = [...layers];
    updatedLayers[index][field] = value;
    setLayers(updatedLayers);
    calculateResistance(updatedLayers);
  };
  
  const handleMaterialChange = (index, value) => {
    const selectedMaterial = materials.find((mat) => mat.name === value);
    if (!selectedMaterial) return; // Evita erro caso `value` seja vazio
    
    const updatedLayers = [...layers];
    updatedLayers[index] = { ...updatedLayers[index], k: selectedMaterial.value, material: value };
    setLayers(updatedLayers);
  };
  
  useEffect(() => {
    calculateResistance(layers);
  }, [layers]);
  useEffect(() => {
    calculateHeatFlux();
  }, [totalResistance, deltaT]);
  


  const handleNumericInput = (value, setter) => {
    // Remove qualquer caractere que não seja número ou ponto decimal
    const sanitizedValue = value.replace(/[^0-9.]/g, "").replace(/^(\d*\.\d*)\./g, "$1");
    const numericValue = parseFloat(sanitizedValue);
  
    // Se for um número válido e >= 0, atualiza o estado
    if (!isNaN(numericValue) && numericValue >= 0) {
      setter(sanitizedValue);
    } else if (sanitizedValue === "") {
      setter(""); // Permite que o campo fique vazio temporariamente
    }
  };
  
  
  const addLayer = () => {
    setLayers([...layers, { k: "", l: "", a: area, material: "" }]);
  };

  const removeLayer = (index) => {
    if (layers.length === 1) return; // Evita remover todas as camadas
    setLayers(layers.filter((_, i) => i !== index));
  };
  

  const calculateResistance = (updatedLayers = layers) => {
    let totalResistance = updatedLayers.reduce((acc, layer) => {
      const k = parseFloat(layer.k);
      const l = parseFloat(layer.l);
      const a = parseFloat(layer.a);
  
      if (isNaN(k) || isNaN(l) || isNaN(a) || k <= 0 || l <= 0 || a <= 0) return acc;
  
      return acc + (l / (k * a));
    }, 0);
  
    setTotalResistance(totalResistance);
  };
  
  

  const calculateHeatFlux = () => {
    if (totalResistance === 0 || isNaN(totalResistance)) {
      setHeatFlux("0.00");
      return;
    }
    const deltaTValue = parseFloat(deltaT) || 0;
   if (isNaN(deltaTValue) || deltaTValue <= 0) {
  setHeatFlux("0.00");
  return;
}
setHeatFlux((deltaTValue / totalResistance).toFixed(5));


  };

  return (
    <Box sx={{ maxWidth: 600, margin: "50px auto", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: "#fff", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Transferência de Calor em Paredes Planas
      </Typography>

      <TextField
  label="Diferença de Temperatura (ΔT em K)"
  type="text"
  value={deltaT}
  onChange={(e) => handleNumericInput(e.target.value, setDeltaT)}
  fullWidth
  margin="normal"
/>

<TextField
  label="Área (m²)"
  type="text"
  value={area}
  onChange={(e) => handleNumericInput(e.target.value, setArea)}
  fullWidth
  margin="normal"
/>

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
          <Typography variant="body1">
            Condutividade térmica (k): <strong>{layer.k ? `${layer.k} W/m.K` : "Selecione um material"}</strong>
          </Typography>
          <TextField
  label="L (Espessura em m)"
  type="text"
  value={layer.l}
  onChange={(e) => handleNumericInput(e.target.value, (val) => handleLayerChange(index, "l", val))}
  fullWidth
/>




  <IconButton onClick={() => removeLayer(index)} sx={{ color: "#9b00d9" }}>
            <RemoveCircleIcon />
          </IconButton>
        </Box>
      ))}

      <Button variant="outlined" onClick={addLayer} startIcon={<AddCircleIcon />} sx={{ marginBottom: "10px", color: "#7300ff", borderColor: "#7300ff", "&:hover": { backgroundColor: "#7300ff", color: "white" } }}>
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
        <TextField label="Resistência Térmica Total (m².K/W)" value={totalResistance.toFixed(6)} fullWidth margin="normal" InputProps={{ readOnly: true }} />
        <TextField label="Fluxo de Calor (Q) em Watts" value={heatFlux} fullWidth margin="normal" InputProps={{ readOnly: true }} />
      </Box>

    </Box>
  );
};

export default HeatTransferCalculator;
