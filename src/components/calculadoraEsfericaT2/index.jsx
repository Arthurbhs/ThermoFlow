import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, useTheme, Button } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import History from "./Components/History";
import MaterialSelector from "../materialSelector";
import ResultBox from "../resultBox";
import CalculateButton from "../calculateButton";
import AddLayerButton from "../addLayerButton";
import TemperatureInput from "../Inputs/Temperature";
import InternalCoefficientInput from "../Inputs/InternalConvectionCoefficient"
import ExternalCoefficientInput from "../Inputs/ExternalConvectionCoefficient"
import ExternalRayInput from "../Inputs/ExternalRayInput";
import InternalRayInput from "../Inputs/InternalRayInput";
import BubbleChart from "../Graphics/BubbleChart";

const SphericalHeatTransfer = () => {
  const theme = useTheme();

  const [layers, setLayers] = useState([{ k: "", r1: "", r2: "", material: "" }]);
  const [deltaT, setDeltaT] = useState("");
  const [hInt, setHInt] = useState(""); // Coeficiente de convecção interno
  const [hExt, setHExt] = useState(""); // Coeficiente de convecção externo
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState("0.00");
  const [history, setHistory] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [view, setView] = useState("result");


  const LOCAL_STORAGE_KEY = "condEsfHistory";

  useEffect(() => {
    fetch("https://materialsapi.onrender.com/materials")
      .then(response => response.json())
      .then(data => setMaterials(data))
      .catch(error => console.error("Erro ao carregar materiais:", error));
  }, []);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    setHistory(savedHistory);
  }, []);

  const handleNumericInput = (value, setter) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  const handleLayerChange = (index, field, value) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setLayers(prevLayers => {
        const updatedLayers = [...prevLayers];
        updatedLayers[index][field] = value;
        return updatedLayers;
      });
    }
  };

  const handleMaterialChange = (index, value) => {
    const selectedMaterial = materials.find((mat) => mat.name === value);
    if (!selectedMaterial) return;
  
    setLayers((prevLayers) =>
      prevLayers.map((layer, i) =>
        i === index
          ? {
              ...layer,
              material: value,
              k: selectedMaterial.thermalConductivityDry, // Define a condutividade térmica
              state: "seco",
            }
          : layer
      )
    );
  };

  const handleStateChange = (index, state) => {
    setLayers(prevLayers =>
      prevLayers.map((layer, i) =>
        i === index
          ? {
              ...layer,
              state,
              k:
                state === "seco"
                  ? materials.find((mat) => mat.name === layer.material)?.thermalConductivityDry || ""
                  : materials.find((mat) => mat.name === layer.material)?.thermalConductivityWet || "",
            }
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

  const isFormValid = () => {
    return (
      deltaT &&
      !isNaN(parseFloat(deltaT)) &&
      parseFloat(deltaT) > 0 &&
      !isNaN(parseFloat(hInt)) &&
      parseFloat(hInt) > 0 &&
      !isNaN(parseFloat(hExt)) &&
      parseFloat(hExt) > 0 &&
      layers.every(layer => {
        const k = parseFloat(layer.k);
        const r1 = parseFloat(layer.r1);
        const r2 = parseFloat(layer.r2);
        return !isNaN(k) && k > 0 && !isNaN(r1) && r1 > 0 && !isNaN(r2) && r2 > r1 && layer.material.trim() !== "";
      })
    );
  };
  const calculateResistanceAndHeatFlux = () => {
    if (!isFormValid()) return;
  
    const r1 = parseFloat(layers[0].r1); // Raio interno
    const rLast = parseFloat(layers[layers.length - 1].r2); // Raio externo
  
    // Resistência térmica da convecção
    const convResistanceInt = 1 / (parseFloat(hInt) * 4 * Math.PI * Math.pow(r1, 2));
    const convResistanceExt = 1 / (parseFloat(hExt) * 4 * Math.PI * Math.pow(rLast, 2));
  
    // Resistência térmica da condução nas camadas
    let conductionResistance = layers.reduce((acc, layer) => {
      const k = parseFloat(layer.k);
      const r1 = parseFloat(layer.r1);
      const r2 = parseFloat(layer.r2);
      if (!isNaN(k) && !isNaN(r1) && !isNaN(r2) && k > 0 && r1 > 0 && r2 > r1) {
        return acc + (1 / (4 * Math.PI * k)) * ((1 / r1) - (1 / r2));
      }
      return acc;
    }, 0);
  
    // Resistência térmica total incluindo condução e convecção
    const totalRes = convResistanceInt + conductionResistance + convResistanceExt;
    setTotalResistance(totalRes);
  
    // Fluxo de calor
    const heatFluxValue = totalRes > 0 ? (parseFloat(deltaT || 0) / totalRes).toFixed(2) : "0.00";
    setHeatFlux(heatFluxValue);
  
    saveToHistory({
      deltaT,
      hInt,
      hExt,
      layers: layers.map(layer => ({
        material: layer.material,
        r1: layer.r1,
        r2: layer.r2,
        state: layer.state || "N/A"
      })),
      totalResistance: !isNaN(totalRes) ? Number(totalRes) : "N/A",
      heatFlux: heatFluxValue,
      timestamp: new Date().toLocaleString()
    });
  };
  

  const saveToHistory = (newEntry) => {
    const updatedHistory = [newEntry, ...history.slice(0, 4)];
    setHistory(updatedHistory);
    localStorage.setItem("condEsfHistory", JSON.stringify(updatedHistory));
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "50px auto", padding: "30px", borderRadius: "16px", backgroundColor: theme.palette.background.paper }}>
    <Typography variant="h4">Transferência de Calor com Convecção</Typography>

    <TemperatureInput value={deltaT} onChange={(e) => handleNumericInput(e.target.value, setDeltaT)} />
    <InternalCoefficientInput value={hInt} onChange={(e) => handleNumericInput(e.target.value, setHInt)} />
    <ExternalCoefficientInput value={hExt} onChange={(e) => handleNumericInput(e.target.value, setHExt)} />
  
    {layers.map((layer, index) => (
      <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <ExternalRayInput value={layer.r1} onChange={(e) => handleLayerChange(index, "r1", e.target.value)}/>
        <InternalRayInput value={layer.r2} onChange={(e) => handleLayerChange(index, "r2", e.target.value)}/>
        
        {/* MaterialSelector para cada camada */}
        <MaterialSelector
          materials={materials}
          selectedMaterial={layer.material}
          selectedState={layer.state}
          onMaterialChange={(value) => handleMaterialChange(index, value)}
          onStateChange={(value) => handleStateChange(index, value)}
        />
  
        <IconButton onClick={() => removeLayer(index)} sx={{ color: "#9b00d9" }}>
          <RemoveCircleIcon />
        </IconButton>
      </Box>
    ))}
  
    <AddLayerButton onClick={addLayer} />
    <CalculateButton onClick={calculateResistanceAndHeatFlux} isFormValid={isFormValid()} />
  
    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 2 }}>
  <Button
    variant={view === "result" ? "contained" : "outlined"}
    onClick={() => setView("result")}
  >
    Resultado
  </Button>
  <Button
    variant={view === "chart" ? "contained" : "outlined"}
    onClick={() => setView("chart")}
  >
    Gráfico
  </Button>
</Box>

{view === "result" && (
  <ResultBox totalResistance={totalResistance} heatFlux={heatFlux} />
)}

{view === "chart" && layers.length > 0 && (
 <BubbleChart selectedMaterials={layers} />

)}


    <History historyData={history} />
  </Box>
  
  );
};

export default SphericalHeatTransfer;
