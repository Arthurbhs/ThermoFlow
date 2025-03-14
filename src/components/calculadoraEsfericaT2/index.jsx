import React, { useState } from "react";
import { 
  Box, TextField, Button, Typography, IconButton, useTheme 
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const SphericalConvectionCalculator = () => {
  const theme = useTheme();
  const [layers, setLayers] = useState([{ h: "", r1: "", r2: "" }]);
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

  const calculateResistanceAndHeatFlux = () => {
    let totalRes = 0;
    layers.forEach(({ h, r1, r2 }) => {
      const hNum = parseFloat(h);
      const r1Num = parseFloat(r1);
      const r2Num = parseFloat(r2);

      if (!isNaN(hNum) && !isNaN(r1Num) && !isNaN(r2Num) && hNum > 0 && r1Num > 0 && r2Num > r1Num) {
        totalRes += (1 / (4 * Math.PI * hNum)) * ((1 / r1Num) - (1 / r2Num));
      }
    });

    setTotalResistance(totalRes);
    setHeatFlux(totalRes > 0 ? (parseFloat(deltaT || 0) / totalRes).toFixed(2) : "0.00");
  };

  const addLayer = () => {
    setLayers([...layers, { h: "", r1: "", r2: "" }]);
  };

  const removeLayer = (index) => {
    setLayers(layers.filter((_, i) => i !== index));
  };

  const isCalculateDisabled = () => {
    if (!deltaT || isNaN(parseFloat(deltaT))) return true;

    return layers.some(({ h, r1, r2 }) => {
      return !h || isNaN(parseFloat(h)) || !r1 || isNaN(parseFloat(r1)) || !r2 || isNaN(parseFloat(r2)) || parseFloat(r2) <= parseFloat(r1);
    });
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "50px auto", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: theme.palette.background.paper, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Transferência de Calor por Convecção em Estruturas Esféricas
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
            label="Raio Interno (r1 em m)"
            value={layer.r1}
            onChange={(e) => handleLayerChange(index, "r1", e.target.value)}
            fullWidth
          />
          <TextField
            label="Raio Externo (r2 em m)"
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
        onClick={calculateResistanceAndHeatFlux}
        disabled={isCalculateDisabled()} // Desabilita até que tudo esteja preenchido corretamente
        sx={{
          display: "block",
          margin: "10px auto",
          backgroundColor: isCalculateDisabled() ? "#ccc" : "#007BFF",
          cursor: isCalculateDisabled() ? "not-allowed" : "pointer"
        }}
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

export default SphericalConvectionCalculator;
