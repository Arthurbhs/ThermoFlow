import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, useTheme, Button } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import History from "./components/History";
import MaterialSelector from "../materialSelector";
import ResultBox from "../resultBox";
import CalculateButton from "../calculateButton";
import AddLayerButton from "../addLayerButton";
import BubbleChart from "../Graphics/BubbleChart";
import TemperatureInput from "../Inputs/Temperature";
import InternalRayInput from "../Inputs/InternalRayInput";
import ExternalRayInput from "../Inputs/ExternalRayInput";
const SphericalHeatTransfer = () => {
  const theme = useTheme();
  const [layers, setLayers] = useState([{ k: "", r1: "", r2: "", material: "" }]);
  const [deltaT, setDeltaT] = useState("");
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState("0.00");
  const [history, setHistory] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [view, setView] = useState("result"); 


  const LOCAL_STORAGE_KEY = "condEsfHistory";

   useEffect(() => {
      
        fetch("https://minha-api-workers.apimateriallistcalculator.workers.dev/src/index")
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
    const savedHistory = JSON.parse(localStorage.getItem("condEsfHistory")) || [];
    setHistory(savedHistory);
  }, []);

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

  const handleMaterialChange = (index, value) => {
  const selectedMaterial = materials.find((mat) => mat.name === value);

  if (!selectedMaterial) return;

  setLayers((prevLayers) =>
    prevLayers.map((layer, i) =>
      i === index
        ? {
            ...layer,
            material: value,
            k: selectedMaterial.thermalConductivityDry, // Valor padrão
            state: "seco", // Define um estado padrão
          }
        : layer
    )
  );
};

const handleStateChange = (index, state) => {
  setLayers((prevLayers) =>
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
    if (!deltaT || isNaN(parseFloat(deltaT)) || parseFloat(deltaT) <= 0) return false;
  
    return layers.every(layer => {
      const k = parseFloat(layer.k);
      const r1 = parseFloat(layer.r1);
      const r2 = parseFloat(layer.r2);
  
      return (
        !isNaN(k) && k > 0 &&
        !isNaN(r1) && r1 > 0 &&
        !isNaN(r2) && r2 > r1 &&
        layer.material.trim() !== "" // Verifica se um material foi selecionado corretamente
      );
    });
  };
  
  useEffect(() => {
    console.log("Materiais carregados:", materials);
  }, [materials]);
  
  

  const calculateResistanceAndHeatFlux = () => {
    let totalRes = layers.reduce((acc, layer) => {
      const k = parseFloat(layer.k);
      const r1 = parseFloat(layer.r1);
      const r2 = parseFloat(layer.r2);
      if (!isNaN(k) && !isNaN(r1) && !isNaN(r2) && k > 0 && r1 > 0 && r2 > r1) {
        return acc + (1 / (4 * Math.PI * k)) * ((1 / r1) - (1 / r2));
      }
      return acc;
    }, 0);

    setTotalResistance(totalRes);
    const heatFluxValue = totalRes > 0 ? (parseFloat(deltaT || 0) / totalRes).toFixed(2) : "0.00";
    setHeatFlux(heatFluxValue);

    saveToHistory({
      deltaT,
      layers: layers.map(layer => ({
        material: layer.material,
        r1: layer.r1,
        r2: layer.r2,
        state: layer.state
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
    <Box sx={{ maxWidth: 600, margin: "50px auto", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: theme.palette.background.paper, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Transferência de Calor em Estruturas Esféricas
      </Typography>
       <TemperatureInput value={deltaT} onChange={(e) => handleNumericInput(e.target.value, setDeltaT)} />
      <Typography variant="h6" gutterBottom>Camadas</Typography>
      {layers.map((layer, index) => (
        <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <InternalRayInput value={layer.r1} onChange={(e) => handleLayerChange(index, "r1", e.target.value)}/>
          <ExternalRayInput value={layer.r2} onChange={(e) => handleLayerChange(index, "r2", e.target.value)}/>
          <MaterialSelector materials={materials} selectedMaterial={layer.material} selectedState={layer.state} onMaterialChange={(value) => handleMaterialChange(index, value)} onStateChange={(value) => handleStateChange(index, value)}/>
 <Typography variant="body1">Condutividade térmica (k): <strong>{layer.k ? `${layer.k} W/m.K` : "Selecione um material"}</strong></Typography>
          <IconButton onClick={() => removeLayer(index)} sx={{ color: "#9b00d9" }}><RemoveCircleIcon /></IconButton>
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


{view === "chart" && layers.length > 0 && layers.some(layer => layer.k && layer.r2) && (
  <BubbleChart selectedMaterials={layers} />
)}

{view === "result" && (
  <ResultBox totalResistance={totalResistance} heatFlux={heatFlux} />
)}

      <History historyData={history} />
    </Box>
  );
};

export default SphericalHeatTransfer;
