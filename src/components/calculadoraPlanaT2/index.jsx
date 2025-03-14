import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, IconButton, useTheme } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const HeatTransferCalculator = () => {
  const theme = useTheme();
  const [layers, setLayers] = useState([{ h: "", a: 1 }]);
  const [deltaT, setDeltaT] = useState("");
  const [area, setArea] = useState(1);
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState("0.00");

  const isFormValid = () => {
    if (!deltaT || !area || parseFloat(deltaT) <= 0 || parseFloat(area) <= 0) return false;
    for (let layer of layers) {
      if (!layer.h || parseFloat(layer.h) <= 0 || parseFloat(layer.a) <= 0) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    setLayers((prevLayers) => prevLayers.map((layer) => ({ ...layer, a: area })));
  }, [area]);

  const handleLayerChange = (index, field, value) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, "").replace(/^([0-9]*\.?[0-9]*).*$/, "$1");
    
    const updatedLayers = [...layers];
    updatedLayers[index][field] = sanitizedValue;
    setLayers(updatedLayers);
    calculateResistance(updatedLayers);
  };

  useEffect(() => {
    calculateResistance(layers);
  }, [layers]);

  useEffect(() => {
    calculateHeatFlux();
  }, [totalResistance, deltaT]);

  const handleNumericInput = (value, setter) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, "").replace(/^([0-9]*\.?[0-9]*).*$/, "$1");
    
    setter(sanitizedValue);
  };

  const addLayer = () => {
    setLayers([...layers, { h: "", a: area }]);
  };

  const removeLayer = (index) => {
    if (layers.length === 1) return;
    setLayers(layers.filter((_, i) => i !== index));
  };

  const calculateResistance = (updatedLayers = layers) => {
    let totalResistance = updatedLayers.reduce((acc, layer) => {
      const h = parseFloat(layer.h);
      const a = parseFloat(layer.a);

      if (isNaN(h) || isNaN(a) || h <= 0 || a <= 0) return acc;

      return acc + (1 / (h * a));
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
    <Box sx={{ maxWidth: 600, margin: "50px auto", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: theme.palette.background.paper, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Transferência de Calor por Convecção
      </Typography>

      <TextField 
        label="Diferença de Temperatura (ΔT em K)" 
        type="text" 
        value={deltaT} 
        onChange={(e) => handleNumericInput(e.target.value, setDeltaT)} 
        fullWidth 
        margin="normal" 
        inputMode="numeric"
      />
      <TextField 
        label="Área (m²)" 
        type="text" 
        value={area} 
        onChange={(e) => handleNumericInput(e.target.value, setArea)} 
        fullWidth 
        margin="normal" 
        inputMode="numeric"
      />

      <Typography variant="h6" gutterBottom>Camadas</Typography>
      {layers.map((layer, index) => (
        <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <TextField 
            label="Coeficiente de Convecção (h) em W/m²K"
            type="text"
            value={layer.h}
            onChange={(e) => handleLayerChange(index, "h", e.target.value)}
            fullWidth
            margin="normal"
            inputMode="numeric"
          />
          <IconButton onClick={() => removeLayer(index)} sx={{ color: "#9b00d9" }}>
            <RemoveCircleIcon />
          </IconButton>
        </Box>
      ))}

      <Button variant="outlined" onClick={addLayer} startIcon={<AddCircleIcon />} sx={{ marginBottom: "10px", color: "#7300ff", borderColor: "#7300ff", "&:hover": { backgroundColor: "#7300ff", color: "white" } }}>Adicionar Camada</Button>

      <Button 
        variant="contained" 
        onClick={() => { calculateResistance(); calculateHeatFlux(); }} 
        disabled={!isFormValid()} 
        sx={{ display: "block", margin: "10px auto", backgroundColor: isFormValid() ? "#007BFF" : "#ccc", "&:hover": { backgroundColor: isFormValid() ? "#0056b3" : "#ccc" } }}
      >
        Calcular
      </Button>
      <Box sx={{ marginTop: "20px", padding: "15px", borderRadius: "8px", backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h6">Resultados</Typography>
        <TextField label="Resistência Térmica Total (K/W)" value={totalResistance.toFixed(6)} fullWidth margin="normal" InputProps={{ readOnly: true }} />
        <TextField label="Fluxo de Calor (Q) em Watts" value={heatFlux} fullWidth margin="normal" InputProps={{ readOnly: true }} />
      </Box>
    </Box>
  );
};

export default HeatTransferCalculator;
