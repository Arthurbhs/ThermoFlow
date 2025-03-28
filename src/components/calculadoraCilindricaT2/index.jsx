import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, IconButton, useTheme } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import History from "./components/History";
import ResultBox from "../resultBox";
import CalculateButton from "../calculateButton";
import AddLayerButton from "../addLayerButton";

const CylindricalConvection = () => {
  // Hooks
  const theme = useTheme();
  
  // Estados
  const [deltaT, setDeltaT] = useState("");
  const [layers, setLayers] = useState([{ length: "", rInternal: "", rExternal: "", h: "" }]);
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState("0.00");
  const [history, setHistory] = useState([]);

  // Efeitos
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("ConvCilHistory")) || [];
    setHistory(storedHistory);
  }, []);

  useEffect(() => {
    if (totalResistance > 0 && heatFlux !== "0.00") {
      saveToHistory();
    }
  }, [totalResistance, heatFlux]);

  // Função para salvar no histórico
  const saveToHistory = () => {
    const newEntry = {
      deltaT,
      layers: layers.map(layer => ({ ...layer })),
      totalResistance: totalResistance.toFixed(6),
      heatFlux,
      timestamp: new Date().toLocaleString(),
    };

    setHistory(prevHistory => {
      const updatedHistory = [newEntry, ...prevHistory.slice(0, 2)];
      localStorage.setItem("ConvCilHistory", JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  // Manipulação de entrada dos campos
  const handleLayerChange = (index, field, value) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setLayers(prevLayers =>
        prevLayers.map((layer, i) => (i === index ? { ...layer, [field]: value } : layer))
      );
    }
  };

  const handleDeltaTChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setDeltaT(value);
    }
  };

  // Cálculo da resistência térmica e fluxo de calor
  const handleCalculate = () => {
    let totalRes = 0;
    layers.forEach(layer => {
      const L = parseFloat(layer.length);
      const rInternal = parseFloat(layer.rInternal);
      const rExternal = parseFloat(layer.rExternal);
      const hValue = parseFloat(layer.h);

      if (!isNaN(L) && !isNaN(rInternal) && !isNaN(rExternal) && !isNaN(hValue) &&
          L > 0 && rInternal > 0 && rExternal > rInternal && hValue > 0) {
        totalRes += Math.log(rExternal / rInternal) / (2 * Math.PI * L * hValue);
      }
    });

    setTotalResistance(totalRes);
    setHeatFlux(totalRes > 0 ? (parseFloat(deltaT || 0) / totalRes).toFixed(2) : "0.00");
  };

  // Validação do formulário
  const isFormValid = () => {
    if (!deltaT || isNaN(parseFloat(deltaT))) return false;
    return layers.every(layer => 
      layer.length && layer.rInternal && layer.rExternal && layer.h &&
      !isNaN(parseFloat(layer.length)) &&
      !isNaN(parseFloat(layer.rInternal)) &&
      !isNaN(parseFloat(layer.rExternal)) &&
      !isNaN(parseFloat(layer.h)) &&
      parseFloat(layer.rExternal) > parseFloat(layer.rInternal)
    );
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "50px auto", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: theme.palette.background.paper, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Transferência de Calor por Convecção
      </Typography>
      
      <TextField label="Diferença de Temperatura (ΔT em K)" value={deltaT} onChange={handleDeltaTChange} fullWidth margin="normal" />

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

      <AddLayerButton onClick={() => setLayers([...layers, { length: "", rInternal: "", rExternal: "", h: "" }])} />
      <CalculateButton onClick={handleCalculate} isFormValid={isFormValid()} />
      <ResultBox totalResistance={totalResistance} heatFlux={heatFlux} />
      <History historyData={history} />
    </Box>
  );
};

export default CylindricalConvection;
