import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import History from "./components/History";
import MaterialSelector from "../materialSelector";
import ResultBox from "../resultBox";
import CalculateButton from "../calculateButton";
import AddLayerButton from "../addLayerButton";
import TemperatureInput from "../Inputs/Temperature";
import HInternalInput from "../Inputs/InternalConvectionCoefficient";
import HExternalInput from "../Inputs/ExternalConvectionCoefficient";
import ThicknessInput from "../Inputs/thicknessInput";

const LOCAL_STORAGE_KEY = "convPlanHistory";

const HeatTransferCalculator = () => {
  const theme = useTheme();
  const [layers, setLayers] = useState([{ h: "", a: 1, material: "", state: "seco" }]);
  const [deltaT, setDeltaT] = useState("");
  const [area, setArea] = useState(1);
  const [hInternal, setHInternal] = useState("");
  const [hExternal, setHExternal] = useState("");
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState("0.00");
  const [history, setHistory] = useState([]);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetch("https://materialsapi.onrender.com/materials")
      .then(response => response.json())
      .then(data => setMaterials(data))
      .catch(error => console.error("Erro ao carregar materiais:", error));
  }, []);

  useEffect(() => {
    const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
    try {
      const savedHistory = JSON.parse(rawData) || [];
      setHistory(savedHistory);
    } catch (error) {
      console.error("Erro ao fazer parse do localStorage:", error);
      setHistory([]);
    }
  }, []);
  
  useEffect(() => {
    if (totalResistance > 0) {
      calculateHeatFlux();
    }
  }, [totalResistance]);

  useEffect(() => {
    if (heatFlux !== "0.00") {
      saveToHistory();
    }
  }, [heatFlux]);

  const handleNumericInput = (value, setter) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, "").replace(/^([0-9]*\.?[0-9]*).*$/, "$1");
    setter(sanitizedValue);
  };

  const handleLayerChange = (index, key, value) => {
    setLayers(prev => prev.map((layer, i) => i === index ? { ...layer, [key]: value } : layer));
  };

  const calculateResistance = () => {
    let total = 0;
  
    layers.forEach(({ h, a, material, state }) => {
      const selectedMaterial = materials.find(m => m.name === material);
      if (!selectedMaterial) return;
  
      const thermalConductivity =
        state === "seco"
          ? selectedMaterial.thermalConductivityDry
          : selectedMaterial.thermalConductivityWet;
  
      const thickness = parseFloat(h);
      const areaValue = parseFloat(a);
  
      if (!isNaN(thickness) && !isNaN(areaValue) && thermalConductivity) {
        total += thickness / (thermalConductivity * areaValue);
      }
    });
  
    // Adicionando resistência térmica por convecção
    const areaValue = parseFloat(area);
    const hInt = parseFloat(hInternal);
    const hExt = parseFloat(hExternal);
  
    if (!isNaN(hInt) && !isNaN(areaValue) && hInt > 0) {
      total += 1 / (hInt * areaValue);
    }
    if (!isNaN(hExt) && !isNaN(areaValue) && hExt > 0) {
      total += 1 / (hExt * areaValue);
    }
  
    setTotalResistance(total);
  };
  
  const calculateHeatFlux = () => {
    const deltaTValue = parseFloat(deltaT);
    setHeatFlux(totalResistance > 0 ? (deltaTValue / totalResistance).toFixed(5) : "0.00");
  };

  const saveToHistory = () => {
    const newEntry = { deltaT, area, hInternal, hExternal, layers, totalResistance, heatFlux, timestamp: new Date().toLocaleString() };
    const updatedHistory = [newEntry, ...history.slice(0, 2)];
    setHistory(updatedHistory);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  const addLayer = () => setLayers([...layers, { h: "", a: area, material: "", state: "seco" }]);
  const removeLayer = (index) => layers.length > 1 && setLayers(layers.filter((_, i) => i !== index));

  const isFormValid = () => deltaT && parseFloat(deltaT) > 0 && layers.every(layer => layer.h && layer.a && layer.material) && hInternal && hExternal;

  return (
    <Box sx={{ maxWidth: 600, margin: "50px auto", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: theme.palette.background.paper, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>Transferência de Calor em Estruturas Planas</Typography>
       <TemperatureInput value={deltaT} onChange={(e) => handleNumericInput(e.target.value, setDeltaT)} />
       <HInternalInput value={hInternal} onChange={(e) => handleNumericInput(e.target.value, setHInternal)} />
        <HExternalInput value={hExternal} onChange={(e) => handleNumericInput(e.target.value, setHExternal)}  />
      <Typography variant="h6" gutterBottom>Camadas</Typography>
      {layers.map((layer, index) => (
        <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
         <MaterialSelector
            materials={materials}
            selectedMaterial={layer.material}
            selectedState={layer.state}
            onMaterialChange={(value) => handleLayerChange(index, "material", value)}
            onStateChange={(value) => handleLayerChange(index, "state", value)}
         />
         <ThicknessInput value={layer.h} onChange={(e) => handleNumericInput(e.target.value, (val) => handleLayerChange(index, "h", val))}/>
         <IconButton onClick={() => removeLayer(index)} sx={{ color: "#9b00d9" }}>
           <RemoveCircleIcon />
         </IconButton>
       </Box>
      ))}
      <AddLayerButton onClick={addLayer} />
      <CalculateButton onClick={calculateResistance} isFormValid={isFormValid()} />
      <ResultBox totalResistance={totalResistance} heatFlux={heatFlux} />
      <History historyData={history} />
    </Box>
  );
};

export default HeatTransferCalculator;
