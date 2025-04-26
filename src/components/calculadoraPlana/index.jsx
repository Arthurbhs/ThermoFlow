import React, { useState, useEffect } from "react";
import { Box,Typography, IconButton, useTheme, Button } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import History from "./components/History";
import MaterialSelector from "../materialSelector";
import ResultBox from "../resultBox";
import CalculateButton from "../calculateButton";
import AddLayerButton from "../addLayerButton";
import ThermalConductivityChart from "../Graphics/ThermalCondutivityChartPlane";
import TemperatureInput from "../Inputs/Temperature";
import AreaInput from "../Inputs/AreaInput";
import ThicknessInput from "../Inputs/thicknessInput";

const LOCAL_STORAGE_KEY = "condPlanHistory";

const HeatTransferCalculator = () => {
  const theme = useTheme();
  const [layers, setLayers] = useState([{ h: "", a: 1, material: "", state: "seco" }]);
  const [deltaT, setDeltaT] = useState("");
  const [area, setArea] = useState(1);
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState("0.00");
  const [history, setHistory] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [viewMode, setViewMode] = useState("resultado"); // ou "grafico"


  useEffect(() => {
    fetch("https://materialsapi.onrender.com/materials")
      .then(response => response.json())
      .then(data => setMaterials(data))
      .catch(error => console.error("Erro ao carregar materiais:", error));
  }, []);
  useEffect(() => {
    const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
    console.log("Dados brutos no localStorage:", rawData);
    try {
      const savedHistory = JSON.parse(rawData) || [];
      console.log("Histórico carregado:", savedHistory);
      setHistory(savedHistory);
    } catch (error) {
      console.error("Erro ao fazer parse do localStorage:", error);
      setHistory([]); // Define um valor padrão para evitar erros
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
    // Criar lista de materiais selecionados para o gráfico
    const selectedMaterials = layers
      .map(layer => {
        const selectedMaterial = materials.find(m => m.name === layer.material);
        if (!selectedMaterial) return null;
  
        return {
          name: layer.material,
          area: layer.a,
          thermalConductivity:
            layer.state === "seco"
              ? selectedMaterial.thermalConductivityDry
              : selectedMaterial.thermalConductivityWet
        };
      })
      .filter(material => material !== null); // Remove materiais inválidos
  
    console.log("Materiais selecionados para o gráfico:", selectedMaterials);
  
    // Calcular resistência térmica total
    let total = layers.reduce((acc, { h, a, material, state }) => {
      const selectedMaterial = materials.find(m => m.name === material);
      if (!selectedMaterial) return acc;
  
      const conductivity =
        state === "seco"
          ? selectedMaterial.thermalConductivityDry
          : selectedMaterial.thermalConductivityWet;
  
      return acc + (h / (conductivity * a));
    }, 0);
  
    setTotalResistance(total);
  };
  

  const calculateHeatFlux = () => {
    const deltaTValue = parseFloat(deltaT);
    setHeatFlux(totalResistance > 0 ? (deltaTValue / totalResistance).toFixed(5) : "0.00");
  };

  const saveToHistory = () => {
    const newEntry = { deltaT, area, layers, totalResistance, heatFlux,  timestamp: new Date().toLocaleString() };
    const updatedHistory = [newEntry, ...history.slice(0, 2)];
    setHistory(updatedHistory);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  const addLayer = () => setLayers([...layers, { h: "", a: area, material: "", state: "seco" }]);
  const removeLayer = (index) => layers.length > 1 && setLayers(layers.filter((_, i) => i !== index));

  const isFormValid = () => deltaT && parseFloat(deltaT) > 0 && layers.every(layer => layer.h && layer.a && layer.material);
  console.log("Layers:", layers);
  return (
    <Box sx={{ maxWidth: 600, margin: "50px auto", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: theme.palette.background.paper, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>Transferência de Calor em Estruturas Planas</Typography>
      <TemperatureInput value={deltaT} onChange={(e) => handleNumericInput(e.target.value, setDeltaT)} />
      <Typography variant="h6" gutterBottom>Camadas</Typography>
      {layers.map((layer, index) => (
        <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
         <MaterialSelector
  materials={materials}
  selectedMaterial={layer.material} // Certifique-se de passar a string correta
  selectedState={layer.state}
  onMaterialChange={(value) => handleLayerChange(index, "material", value)}
  onStateChange={(value) => handleLayerChange(index, "state", value)}
/>
          <ThicknessInput value={layer.h} onChange={(e) => handleNumericInput(e.target.value, (val) => handleLayerChange(index, "h", val))}/>
          <AreaInput value={layer.a} onChange={(e) => handleNumericInput(e.target.value, (val) => handleLayerChange(index, "a", val))} />
          <IconButton onClick={() => removeLayer(index)} sx={{ color: "#9b00d9" }}>
            <RemoveCircleIcon />
          </IconButton>
        </Box>
      ))}
      <AddLayerButton onClick={addLayer} />
      <CalculateButton onClick={calculateResistance} isFormValid={isFormValid()} />
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
  <Button 
    variant={viewMode === "resultado" ? "contained" : "outlined"}
    onClick={() => setViewMode("resultado")}
    color="primary"
  >
    Ver Resultado
  </Button>
  <Button 
    variant={viewMode === "grafico" ? "contained" : "outlined"}
    onClick={() => setViewMode("grafico")}
    color="secondary"
  >
    Ver Gráfico
  </Button>
</Box>

      {viewMode === "resultado" ? (
  <ResultBox totalResistance={totalResistance} heatFlux={heatFlux} />
) : (
  <ThermalConductivityChart
  selectedMaterials={layers.map(layer => {
    const selectedMaterial = materials.find(m => m.name === layer.material);
    if (!selectedMaterial) return null;
    return {
      name: layer.material,
      area: layer.a,
      thermalConductivity:
        layer.state === "seco"
          ? selectedMaterial.thermalConductivityDry
          : selectedMaterial.thermalConductivityWet,
      length: parseFloat(layer.h) || 0  // <- ESSA LINHA
    };
  }).filter(material => material !== null)}
/>

)}

 <History historyData={history} />
    </Box>
  );
};

export default HeatTransferCalculator;
