import React, { useState, useEffect } from "react";
import { Box,Typography, IconButton, useTheme, Button } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import History from "./componentes/History";
import MaterialSelector from "../materialSelector";
import ResultBox from "../resultBox";
import CalculateButton from "../calculateButton";
import AddLayerButton from "../addLayerButton";
import ThermalConductivityChart from "../Graphics/ThermalConductivityChart";
import TemperatureInput from "../Inputs/Temperature";
import CylinderLengthInput from "../Inputs/CylinderLengthInput";
import InternalRayInput from "../Inputs/InternalRayInput";
import ExternalRayInput from "../Inputs/ExternalRayInput";
import BubbleChart from "../Graphics/BubbleChart";

const CylindricalConduction = () => {
  const theme = useTheme();
  
  // Estados
  const [deltaT, setDeltaT] = useState("");
  const [layers, setLayers] = useState([{ length: "", radius1: "", radius2: "", k: "" }]);
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState(0);
  const [history, setHistory] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [activeView, setActiveView] = useState("result");


  // Efeito para carregar os materiais
  const LOCAL_STORAGE_KEY = "condCilHistory";

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

  // Efeito para carregar o histórico salvo
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("condCilHistory")) || [];
    setHistory(storedHistory);
  }, []);

  // Efeito para salvar novo cálculo no histórico
  useEffect(() => {
    if (totalResistance > 0) {
      saveToHistory(totalResistance);
    }
  }, [totalResistance]);

  // Manipuladores de entrada
  const handleLayerChange = (index, field, value) => {
    if (/^-?\d*\.?\d*$/.test(value)) {
      setLayers(prevLayers =>
        prevLayers.map((layer, i) => (i === index ? { ...layer, [field]: value } : layer))
      );
    }
  };

  const handleMaterialChange = (index, value) => {
    const selectedMaterial = materials.find(mat => mat.name === value);
    if (!selectedMaterial) return;
  
    setLayers(prev => {
      const newLayers = [...prev];
      newLayers[index] = { 
        ...newLayers[index], 
        k: selectedMaterial.thermalConductivityDry, // ✅ Correto
        material: selectedMaterial.name,
        state: "seco" // Define um estado padrão
      };
      return newLayers;
    });
  };

  const chartData = layers
  .map(layer => ({
    material: layer.material || "Desconhecido",
    k: parseFloat(layer.k) || 0,
    length: parseFloat(layer.length) || 0,
    r1: parseFloat(layer.radius1) || 0,
    r2: parseFloat(layer.radius2) || 0,
  }))
  .filter(layer => layer.material);

// Botões de visualização
const views = [
  { key: "result", label: "Resultado" },
  { key: "chart", label: "Condutividade" },
  { key: "bubble", label: "Raios" },
];
  
  const handleStateChange = (index, state) => {
    setLayers(prev =>
      prev.map((layer, i) =>
        i === index
          ? {
              ...layer,
              state,
              k: state === "seco"
                ? materials.find(mat => mat.name === layer.material)?.thermalConductivityDry || ""
                : materials.find(mat => mat.name === layer.material)?.thermalConductivityWet || "",
            }
          : layer
      )
    );
  };
  
  
  
  // Validação do formulário
  const isFormValid = () => {
    if (!deltaT) return false;
    return layers.every(layer => 
      layer.length && layer.radius1 && layer.radius2 && layer.k && 
      parseFloat(layer.radius2) > parseFloat(layer.radius1)
    );
  };
// removar e adicionar camada
  const addLayer = () => {
    setLayers((prevLayers) => [...prevLayers, { length: "", radius1: "", radius2: "", k: "" }]);
  };
  
  const removeLayer = (index) => {
    setLayers(layers.filter((_, i) => i !== index));
  };

  // Cálculo da resistência térmica e fluxo de calor
  const handleCalculate = () => {
    let totalRes = 0;
    let valid = true;
  
    layers.forEach(layer => {
      const L = parseFloat(layer.length);
      const r1 = parseFloat(layer.radius1);
      const r2 = parseFloat(layer.radius2);
      const kValue = parseFloat(layer.k);
  
      if (isNaN(L) || isNaN(r1) || isNaN(r2) || isNaN(kValue) || L <= 0 || r1 <= 0 || r2 <= r1 || kValue <= 0) {
        valid = false;
        return;
      }
  
      totalRes += Math.log(r2 / r1) / (2 * Math.PI * kValue * L);
    });
  
    if (valid && deltaT) {
      const parsedDeltaT = parseFloat(deltaT);
      if (!isNaN(parsedDeltaT)) {
        setTotalResistance(totalRes);
        setHeatFlux((parsedDeltaT / totalRes).toFixed(2));
      }
    } else {
      alert("Erro: Certifique-se de que todos os valores são válidos e que o raio externo é maior que o raio interno.");
    }
  };

  // Gerenciamento do histórico
  const saveToHistory = (totalRes) => {
    const newEntry = {
      deltaT,
      totalResistance: Number(totalRes).toFixed(6),
      heatFlux: (parseFloat(deltaT) / totalRes).toFixed(2),
      layers: layers.map(layer => ({
        material: layer.material || "Desconhecido",
        state: layer.state || "seco",
        length: layer.length || "0",
        radius1: layer.radius1 || "0",
        radius2: layer.radius2 || "0"
      })),
      
      timestamp: new Date().toLocaleString(),
    };
  
    let storedHistory = JSON.parse(localStorage.getItem("condCilHistory")) || [];
    storedHistory.unshift(newEntry);
  
    if (storedHistory.length > 3) {
      storedHistory = storedHistory.slice(0, 3);
    }
  
    localStorage.setItem("condCilHistory", JSON.stringify(storedHistory));
    setHistory([...storedHistory]);
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "50px auto", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: theme.palette.background.paper, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Transferência de Calor em Estruturas cilindricas
      </Typography>

      <TemperatureInput value={deltaT} onChange={(e) => {
          const value = e.target.value;
          if (/^-?\d*\.?\d*$/.test(value)) {
            setDeltaT(value);
          }
        }}/>
   

     

      {layers.map((layer, index) => (
        <Box key={index} sx={{ marginBottom: "15px", textAlign: "center" }}>
          <CylinderLengthInput value={layer.length} onChange={(e) => handleLayerChange(index, "length", e.target.value)}/>
            <InternalRayInput value={layer.radius1} onChange={(e) => handleLayerChange(index, "radius1", e.target.value)} />
            <ExternalRayInput value={layer.radius2} onChange={(e) => handleLayerChange(index, "radius2", e.target.value)} />
          <MaterialSelector materials={materials} selectedMaterial={layer.material}selectedState={layer.state}onMaterialChange={(value) => handleMaterialChange(index, value)}onStateChange={(value) => handleStateChange(index, value)}/>
 <IconButton onClick={() => removeLayer(index)}><RemoveCircleIcon /></IconButton>
        </Box>
      ))}

      <AddLayerButton onClick={addLayer} />
      <CalculateButton onClick={handleCalculate} isFormValid={isFormValid()} />

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
  {views.map(({ key, label }) => (
    <Button
      key={key}
      variant={activeView === key ? "contained" : "outlined"}
      onClick={() => setActiveView(key)}
    >
      {label}
    </Button>
  ))}
</Box>

{activeView === "result" && (
  <ResultBox totalResistance={totalResistance} heatFlux={heatFlux} />
)}

{activeView === "chart" && (
  chartData.length > 0 ? (
    <ThermalConductivityChart selectedMaterials={chartData} />
  ) : (
    <Typography variant="body2" color="text.secondary">
      Nenhum material válido selecionado para exibir a condutividade térmica.
    </Typography>
  )
)}

{activeView === "bubble" && (
  chartData.length > 0 ? (
    <BubbleChart selectedMaterials={chartData} />
  ) : (
    <Typography variant="body2" color="text.secondary">
      Nenhum dado de raio válido para exibir o gráfico.
    </Typography>
  )
)}

      <History historyData={history} />
    </Box>
  );
};

export default CylindricalConduction;
