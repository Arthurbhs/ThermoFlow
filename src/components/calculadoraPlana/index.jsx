import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, IconButton, useTheme } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import History from "./components/History";
import MaterialSelector from "../materialSelector";
import ResultBox from "../resultBox";
import CalculateButton from "../calculateButton";
import AddLayerButton from "../addLayerButton";

const LOCAL_STORAGE_KEY = "condPlanHistory";

const HeatTransferCalculator = () => {
  const theme = useTheme();
  const [layers, setLayers] = useState([{ h: "", a: 1, material: "" }]);
  const [deltaT, setDeltaT] = useState("");
  const [area, setArea] = useState(1);
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState("0.00");
  const [history, setHistory] = useState([]);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetch("https://materialsapi.onrender.com/materials")
      .then(response => response.json())
      .then(data => {
        const formattedMaterials = [
          { name: "Selecione um material", value: "" },
          ...data.map(metal => ({ name: metal.name, value: metal.thermalConductivity }))
        ];
        setMaterials(formattedMaterials);
      })
      .catch(error => console.error("Erro ao carregar materiais:", error));
  }, []);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    setHistory(savedHistory);
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
  

  const handleLayerChange = (index, field, value) => {
    setLayers(prev => prev.map((layer, i) => (i === index ? { ...layer, [field]: value } : layer)));
  };

  const handleMaterialChange = (index, value) => {
    const selectedMaterial = materials.find(mat => mat.name === value);
    if (!selectedMaterial) return;
    
    setLayers(prev => prev.map((layer, i) => (
      i === index ? { ...layer, h: selectedMaterial.value, material: value } : layer
    )));
  };

  const calculateResistance = () => {
    let total = layers.reduce((acc, { h, a }) => acc + (1 / (parseFloat(h) * parseFloat(a) || 1)), 0);
    setTotalResistance(total);
  };

  const calculateHeatFlux = () => {
    const deltaTValue = parseFloat(deltaT);
    setHeatFlux(totalResistance > 0 ? (deltaTValue / totalResistance).toFixed(5) : "0.00");
  };

  const saveToHistory = () => {
    const newEntry = { deltaT, area, layers, totalResistance, heatFlux, timestamp: new Date().toLocaleString() };
    const updatedHistory = [newEntry, ...history.slice(0, 2)];
    setHistory(updatedHistory);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  const addLayer = () => setLayers([...layers, { h: "", a: area, material: "" }]);
  const removeLayer = (index) => layers.length > 1 && setLayers(layers.filter((_, i) => i !== index));

  const isFormValid = () => deltaT && parseFloat(deltaT) > 0 && layers.every(layer => layer.h && layer.a && layer.material);

  return (
    <Box sx={{ maxWidth: 600, margin: "50px auto", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: theme.palette.background.paper, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>Transferência de Calor por Convecção</Typography>
      <TextField label="Diferença de Temperatura (ΔT em K)" value={deltaT} onChange={(e) => handleNumericInput(e.target.value, setDeltaT)} fullWidth margin="normal" />
      <Typography variant="h6" gutterBottom>Camadas</Typography>
      {layers.map((layer, index) => (
        <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
         <TextField label="Área (m²)" value={layer.a}onChange={(e) => handleNumericInput(e.target.value, (val) => handleLayerChange(index, "a", val))} fullWidth margin="normal"/>
          <MaterialSelector materials={materials} selectedMaterial={layer.material} onChange={(value) => handleMaterialChange(index, value)} />
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
