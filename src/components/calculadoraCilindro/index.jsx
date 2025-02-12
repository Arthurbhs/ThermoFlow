import React, { useState } from "react";
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

const CylindricalHeatTransfer = () => {
  const [layers, setLayers] = useState([{ k: "", r1: "", r2: "", material: "" }]);
  const [deltaT, setDeltaT] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState({});



  const handleLayerChange = (index, field, value) => {
    // Permite apenas números positivos ou zero
    if (!/^\d*\.?\d*$/.test(value) || parseFloat(value) < 0) return; 
    
    let updatedLayers = [...layers];
    updatedLayers[index][field] = value;
    setLayers(updatedLayers);
  };
  

  const handleMaterialChange = (index, value) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer, i) =>
        i === index
          ? { ...layer, material: value, k: materials.find((mat) => mat.name === value)?.value || "" }
          : layer
      )
    );

  };

  const addLayer = () => {
    setLayers([...layers, { k: "", r1: "", r2: "", material: "" }]);
  };

  const removeLayer = (index) => {
    setLayers(layers.filter((_, i) => i !== index));

  };

  const calculateResistance = () => {
    return layers.reduce((totalResistance, layer) => {
      const k = parseFloat(layer.k);
      const r1 = parseFloat(layer.r1);
      const r2 = parseFloat(layer.r2);
      if (k > 0 && r1 > 0 && r2 > r1) {
        return totalResistance + Math.log(r2 / r1) / (2 * Math.PI * k);
      }
      return totalResistance;
    }, 0);
  };


  return (
    <Box sx={{ maxWidth: 600, margin: "50px auto", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: "#fff", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Transferência de Calor em Estruturas Cilíndricas
      </Typography>
      <TextField
  label="Diferença de Temperatura (ΔT em K)"
  type="number"
  value={deltaT}
  onChange={(e) => setDeltaT(e.target.value)
  }
  
  onKeyPress={(e) => {
    // Permitir apenas números e ponto decimal
    if (!/[\d\.]/.test(e.key)) {
      e.preventDefault();
    }
  }}
  onInput={(e) => {
    // Verificar se o valor é negativo, se for, impedir
    if (parseFloat(e.target.value) < 0) {
      e.preventDefault();
    }
  }}
  fullWidth
  margin="normal"
  error={parseFloat(deltaT) < 0}
  helperText={parseFloat(deltaT) < 0 ? "O valor deve ser maior ou igual a 0" : ""}
/>
  <Typography variant="h6" gutterBottom>Camadas</Typography>
      {layers.map((layer, index) => (
        <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <FormControl fullWidth>
            <InputLabel>Material</InputLabel>
            <Select value={layer.material} onChange={(e) => handleMaterialChange(index, e.target.value)}>
              {materials.map((mat, i) => (
                <MenuItem key={i} value={mat.name}>{mat.name}</MenuItem>
              ))}
            </Select>
            <Typography variant="body1">Condutividade térmica (k): <strong>{layer.k ? `${layer.k} W/m.K` : "Selecione um material"}</strong></Typography>
          </FormControl>
         <TextField
  label="Raio Interno (m)"
  type="number"
  value={layer.r1}
  onChange={(e) => handleLayerChange(index, "r1", e.target.value)}
  onKeyPress={(e) => {
    // Permitir apenas números e ponto decimal
    if (!/[\d\.]/.test(e.key)) {
      e.preventDefault();
    }
  }}
  fullWidth
  error={!!errors[`r1-${index}`]}
  helperText={errors[`r1-${index}`] || ""}
 />
 <TextField
  label="Raio Externo (m)"
  type="number"
  value={layer.r2}
  onInput={(e) => {
    // Permitir apenas números e ponto decimal
    if (parseFloat(e.target.value) < 0) {
      e.preventDefault();
    }
  }}
  onChange={(e) => handleLayerChange(index, "r2", e.target.value)}
  onKeyPress={(e) => {
    // Permitir apenas números e ponto decimal
    if (!/[\d\.]/.test(e.key)) {
      e.preventDefault();
    }
  }}
  fullWidth
  error={!!errors[`r2-${index}`]}
  helperText={errors[`r2-${index}`] || ""}
/>
 <IconButton onClick={() => removeLayer(index)} sx={{ color: "#9b00d9" }}>
            <RemoveCircleIcon />
          </IconButton>
        </Box>
      ))}
      <Button variant="outlined" onClick={addLayer} startIcon={<AddCircleIcon />} sx={{ marginBottom: "20px", color: "#7300ff", borderColor: "#7300ff", "&:hover": { backgroundColor: "#7300ff", color: "white" } }}>Adicionar Camada</Button>
    <Button
  variant="contained"
  onClick={() => {
    calculateResistance();
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
        <TextField label="Resistência Térmica Total (m².K/W)" value={calculateResistance().toFixed(6)} fullWidth margin="normal" InputProps={{ readOnly: true }} />
        <TextField label="Fluxo de Calor (Q) em Watts" value={(calculateResistance() > 0 ? (parseFloat(deltaT) / calculateResistance()).toFixed(2) : "0.00")} fullWidth margin="normal" InputProps={{ readOnly: true }} />
      </Box>

    </Box>
  );
};

export default CylindricalHeatTransfer;
