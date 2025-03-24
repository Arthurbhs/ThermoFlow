import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import History from "./components/History";

const CylindricalConvection = () => {
  const theme = useTheme();
  const [deltaT, setDeltaT] = useState("");
  const [layers, setLayers] = useState([{ length: "", rInternal: "", rExternal: "", h: "" }]);
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState("0.00");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("heatTransferHistory")) || [];
    setHistory(storedHistory);
  }, []);

  useEffect(() => {
    if (totalResistance > 0 && heatFlux !== "0.00") {
      saveToHistory();
    }
  }, [totalResistance, heatFlux]);

  const handleLayerChange = (index, field, value) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setLayers(prevLayers =>
        prevLayers.map((layer, i) =>
          i === index ? { ...layer, [field]: value } : layer
        )
      );
    }
  };

  const saveToHistory = () => {
    const newEntry = {
      deltaT,
      layers: layers.map(layer => ({
        length: layer.length,
        rInternal: layer.rInternal,
        rExternal: layer.rExternal,
        h: layer.h
      })),
      totalResistance: totalResistance.toFixed(6),
      heatFlux,
      timestamp: new Date().toLocaleString(),
    };

    setHistory(prevHistory => {
      const updatedHistory = [newEntry, ...prevHistory.slice(0, 2)];
      localStorage.setItem("heatTransferHistory", JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  const handleCalculate = () => {
    let totalRes = 0;
    layers.forEach((layer) => {
      const L = parseFloat(layer.length);
      const rInternal = parseFloat(layer.rInternal);
      const rExternal = parseFloat(layer.rExternal);
      const hValue = parseFloat(layer.h);

      if (!isNaN(L) && !isNaN(rInternal) && !isNaN(rExternal) && !isNaN(hValue) && L > 0 && rInternal > 0 && rExternal > rInternal && hValue > 0) {
        totalRes += Math.log(rExternal / rInternal) / (2 * Math.PI * L * hValue);
      }
    });

    setTotalResistance(totalRes);
    setHeatFlux(totalRes > 0 ? (parseFloat(deltaT || 0) / totalRes).toFixed(2) : "0.00");
  };

  const isCalculateDisabled = layers.some(layer => parseFloat(layer.rInternal) >= parseFloat(layer.rExternal));

  return (
    <Box sx={{ maxWidth: 500, margin: "50px auto", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: theme.palette.background.paper, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Transferência de Calor por Convecção
      </Typography>

      <TextField label="Diferença de Temperatura (ΔT em K)" value={deltaT} onChange={(e) => setDeltaT(e.target.value)} fullWidth margin="normal" />

      <Typography variant="h6" gutterBottom>
        Camadas
      </Typography>
      {layers.map((layer, index) => (
        <Box key={index} sx={{ marginBottom: "15px", textAlign: "center" }}>
          <TextField label="Comprimento do Cilindro (m)" value={layer.length} onChange={(e) => handleLayerChange(index, "length", e.target.value)} fullWidth margin="normal" />
          <TextField label="Raio Interno (m)" value={layer.rInternal} onChange={(e) => handleLayerChange(index, "rInternal", e.target.value)} fullWidth margin="normal" error={parseFloat(layer.rInternal) >= parseFloat(layer.rExternal)} helperText={parseFloat(layer.rInternal) >= parseFloat(layer.rExternal) ? "O raio interno deve ser menor que o raio externo" : ""} />
          <TextField label="Raio Externo (m)" value={layer.rExternal} onChange={(e) => handleLayerChange(index, "rExternal", e.target.value)} fullWidth margin="normal" />
          <TextField label="Coeficiente de Convecção (h em W/m².K)" value={layer.h} onChange={(e) => handleLayerChange(index, "h", e.target.value)} fullWidth margin="normal" />
          <IconButton onClick={() => setLayers(layers.filter((_, i) => i !== index))} sx={{ color: "#9b00d9" }}>
            <RemoveCircleIcon />
          </IconButton>
        </Box>
      ))}

      <Button variant="outlined" onClick={() => setLayers([...layers, { length: "", rInternal: "", rExternal: "", h: "" }])} startIcon={<AddCircleIcon />} sx={{ marginBottom: "20px", color: "#7300ff", borderColor: "#7300ff", "&:hover": { backgroundColor: "#7300ff", color: "white" } }}>
        Adicionar Camada
      </Button>

      <Button variant="contained" onClick={handleCalculate} disabled={isCalculateDisabled} sx={{ display: "block", margin: "10px auto", backgroundColor: isCalculateDisabled ? "#ccc" : "#007BFF", cursor: isCalculateDisabled ? "not-allowed" : "pointer" }}>
        Calcular
      </Button>

      <Box sx={{ marginTop: "20px", padding: "15px", borderRadius: "8px", backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h6">Resultados</Typography>
        <TextField label="Resistência Térmica Total (K/W)" value={totalResistance.toFixed(6)} fullWidth margin="normal" InputProps={{ readOnly: true }} />
        <TextField label="Fluxo de Calor (Q) em Watts" value={heatFlux} fullWidth margin="normal" InputProps={{ readOnly: true }} />
      </Box>

      <History historyData={history} />
    </Box>
  );
};

export default CylindricalConvection;
