import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, IconButton, useTheme } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import History from "./components/History";
import ResultBox from "../resultBox";
import CalculateButton from "../calculateButton";
import AddLayerButton from "../addLayerButton";

const HeatTransferCalculator = () => {
  const theme = useTheme();
  const [layers, setLayers] = useState([{ h: "", a: "" }]);
  const [deltaT, setDeltaT] = useState("");
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState("0.00");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("convPlanHistory")) || [];
    setHistory(storedHistory);
  }, []);

  useEffect(() => {
    if (totalResistance > 0 && heatFlux !== "0.00") {
      saveToHistory();
    }
  }, [totalResistance, heatFlux]);

  const addLayer = () => {
    setLayers([...layers, { h: "", a: "" }])
  }

  const handleNumericInput = (value, setter) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, "").replace(/^([0-9]*\.?[0-9]*).*$/, "$1");
    setter(sanitizedValue);
  };

  const handleLayerChange = (index, field, value) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, "").replace(/^([0-9]*\.?[0-9]*).*$/, "$1");
    setLayers((prevLayers) => {
      const updatedLayers = [...prevLayers];
      updatedLayers[index][field] = sanitizedValue;
      return updatedLayers;
    });
  };

  const isFormValid = () => {
    if (!deltaT || parseFloat(deltaT) <= 0) return false;
    return layers.every(layer => parseFloat(layer.h) > 0 && parseFloat(layer.a) > 0);
  };

  const calculateResistance = () => {
    let total = layers.reduce((acc, layer) => {
      const h = parseFloat(layer.h);
      const a = parseFloat(layer.a);
      return isNaN(h) || isNaN(a) || h <= 0 || a <= 0 ? acc : acc + (1 / (h * a));
    }, 0);
    setTotalResistance(total);
    calculateHeatFlux(total);
  };

  const calculateHeatFlux = (resistance) => {
    const deltaTValue = parseFloat(deltaT);
    if (resistance === 0 || isNaN(deltaTValue) || deltaTValue <= 0) {
      setHeatFlux("0.00");
      return;
    }
    const calculatedHeatFlux = (deltaTValue / resistance).toFixed(5);
    setHeatFlux(calculatedHeatFlux);
  };

  const saveToHistory = () => {
    const newEntry = {
      deltaT,
      layers: layers.map(layer => ({ h: layer.h, a: layer.a })),
      totalResistance: totalResistance.toFixed(6),
      heatFlux,
      timestamp: new Date().toLocaleString(),
    };

    setHistory(prevHistory => {
      const updatedHistory = [newEntry, ...prevHistory.slice(0, 2)];
      localStorage.setItem("convPlanHistory", JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "50px auto", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: theme.palette.background.paper, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>Transferência de Calor por Convecção</Typography>
      <TextField label="Diferença de Temperatura (ΔT em K)" value={deltaT} onChange={(e) => handleNumericInput(e.target.value, setDeltaT)} fullWidth margin="normal" />
      <Typography variant="h6" gutterBottom>Camadas</Typography>
      {layers.map((layer, index) => (
        <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <TextField label="Área (m²)" value={layer.a} onChange={(e) => handleLayerChange(index, "a", e.target.value)} fullWidth margin="normal" />
          <TextField label="Coeficiente de Convecção (h) em W/m²K" value={layer.h} onChange={(e) => handleLayerChange(index, "h", e.target.value)} fullWidth margin="normal" />
          <IconButton onClick={() => setLayers(layers.filter((_, i) => i !== index))} sx={{ color: "#9b00d9" }}><RemoveCircleIcon /></IconButton>
        </Box>
      ))}
     
     <AddLayerButton onClick={addLayer} />
      <CalculateButton onClick={calculateResistance} isFormValid={isFormValid()}/>
     <ResultBox totalResistance={totalResistance} heatFlux={heatFlux}/>
      <History historyData={history} />
    </Box>
  );
};

export default HeatTransferCalculator;
