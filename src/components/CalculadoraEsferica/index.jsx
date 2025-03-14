import React, { useState } from "react";
import { Box, TextField, Button, Typography, IconButton, MenuItem, Select, FormControl, InputLabel, useTheme } from "@mui/material";
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
  const theme = useTheme();
  const [layers, setLayers] = useState([{ k: "", r1: "", r2: "", material: "" }]);
  const [deltaT, setDeltaT] = useState("");
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState("0.00");

  const handleNumericInput = (value, setter) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  const handleLayerChange = (index, field, value) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      const updatedLayers = [...layers];
      updatedLayers[index][field] = value;
      setLayers(updatedLayers);
    }
  };
  
  

  const isFormValid = () => {
    if (!deltaT || isNaN(parseFloat(deltaT)) || parseFloat(deltaT) <= 0) return false;
    return layers.every(layer => {
      const k = parseFloat(layer.k);
      const r1 = parseFloat(layer.r1);
      const r2 = parseFloat(layer.r2);
  
      return (
        !isNaN(k) && k > 0 &&
        !isNaN(r1) && r1 > 0 &&
        !isNaN(r2) && r2 > r1
      );
    });
  };
  
  

  const handleMaterialChange = (index, value) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer, i) =>
        i === index
          ? {
              ...layer,
              material: value,
              k: materials.find((mat) => mat.name === value)?.value || "",
              r1: "",
              r2: ""
            }
          : layer
      )
    );
  };
  

  const addLayer = () => {
    setLayers([...layers, { k: "", r1: "", r2: "", material: "" }]);
  };

  const removeLayer = (index) => {
    const updatedLayers = layers.filter((_, i) => i !== index);
    setLayers(updatedLayers);
  };

  const calculateResistanceAndHeatFlux = () => {
    let totalRes = 0;
    layers.forEach((layer) => {
      const k = parseFloat(layer.k);
      const r1 = parseFloat(layer.r1);
      const r2 = parseFloat(layer.r2);
  
      if (!isNaN(k) && !isNaN(r1) && !isNaN(r2) && k > 0 && r1 > 0 && r2 > r1) {
        totalRes += (1 / (4 * Math.PI * k)) * ((1 / r1) - (1 / r2));
      }
    });
  
    setTotalResistance(totalRes);
  
    if (totalRes > 0) {
      setHeatFlux((parseFloat(deltaT || 0) / totalRes).toFixed(2));
    } else {
      setHeatFlux("0.00");
    }
  };
  

  return (
    <Box sx={{ maxWidth: 600, margin: "50px auto", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",  backgroundColor: theme.palette.background.paper, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Transferência de Calor em Estruturas Esféricas
      </Typography>

      <TextField
        label="Diferença de Temperatura (ΔT em K)"
        value={deltaT}
        onChange={(e) => handleNumericInput(e.target.value, setDeltaT)}
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
  label="Raio Interno (m)"
  
  value={layer.r1}
  onChange={(e) => handleLayerChange(index, "r1", e.target.value)}
  fullWidth
  inputProps={{ min: 0, step: "any" }}
  error={layer.r1 !== "" && (isNaN(layer.r1) || parseFloat(layer.r1) <= 0)}
  helperText={layer.r1 !== "" && parseFloat(layer.r1) <= 0 ? "Valor deve ser maior que zero" : ""}
/>

          <TextField
          
            label="Raio Externo (m)"
            value={layer.r2}
            onChange={(e) => handleLayerChange(index, "r2", e.target.value)}
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
              calculateResistanceAndHeatFlux();
             }}
             disabled={!isFormValid()}
             sx={{
               display: "block",
               margin: "10px auto",
               backgroundColor: isFormValid() ? "#007BFF" : "#b0c4de",
               "&:hover": { backgroundColor: isFormValid() ? "#0056b3" : "#b0c4de" },
             }}
           >
             Calcular
           </Button>

      <Box sx={{ marginTop: "20px", padding: "15px", borderRadius: "8px",  backgroundColor: theme.palette.background.paper}}>
        <Typography variant="h6">Resultados</Typography>
        <TextField label="Resistência Térmica Total (K/W)" value={totalResistance.toFixed(6)} fullWidth margin="normal" InputProps={{ readOnly: true }} />
        <TextField label="Fluxo de Calor (Q) em Watts" value={heatFlux} fullWidth margin="normal" InputProps={{ readOnly: true }} />
      </Box>

     
    </Box>
  );
};

export default SphericalHeatTransfer;
