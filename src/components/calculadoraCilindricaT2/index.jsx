import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  Button,
} from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import History from "./components/History";
import ResultBox from "../resultBox";
import BubbleChart from "../Graphics/BubbleChart";
import ThermalConductivityChart from "../Graphics/ThermalConductivityChart";
import CalculateButton from "../calculateButton";
import AddLayerButton from "../addLayerButton";
import MaterialSelector from "../materialSelector";
import TemperatureInput from "../Inputs/Temperature";
import HInternalInput from "../Inputs/InternalConvectionCoefficient";
import HExternalInput from "../Inputs/ExternalConvectionCoefficient";
import ExternalRayInput from "../Inputs/ExternalRayInput";
import InternalRayInput from "../Inputs/InternalRayInput";
import CylinderLengthInput from "../Inputs/CylinderLengthInput";

const CylindricalConvection = () => {
  const theme = useTheme();

  // Estados principais
  const [deltaT, setDeltaT] = useState("");
  const [hInternal, setHInternal] = useState("");
  const [hExternal, setHExternal] = useState("");
  const [layers, setLayers] = useState([
    { length: "", radius1: "", radius2: "", k: "" },
  ]);
  const [materials, setMaterials] = useState([]);
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState(0);
  const [history, setHistory] = useState([]);
  const [activeView, setActiveView] = useState("result");

  const LOCAL_STORAGE_KEY = "convCilHistory";

  // Carregar materiais
  useEffect(() => {
    fetch("https://materialsapi.onrender.com/materials")
      .then((response) => response.json())
      .then((data) => setMaterials(data))
      .catch((error) =>
        console.error("Erro ao carregar materiais:", error)
      );
  }, []);

  // Carregar histórico
  useEffect(() => {
    const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
    try {
      const savedHistory = JSON.parse(rawData) || [];
      setHistory(savedHistory);
    } catch (error) {
      console.error("Erro ao fazer parse do localStorage:", error);
    }
  }, []);

  // Salvar novo cálculo
  useEffect(() => {
    if (totalResistance > 0) {
      saveToHistory(totalResistance);
    }
  }, [totalResistance]);

  const handleLayerChange = (index, field, value) => {
    if (/^-?\d*\.?\d*$/.test(value)) {
      setLayers((prev) =>
        prev.map((layer, i) =>
          i === index ? { ...layer, [field]: value } : layer
        )
      );
    }
  };

  const handleMaterialChange = (index, value) => {
    const selectedMaterial = materials.find((mat) => mat.name === value);
    if (!selectedMaterial) return;

    setLayers((prev) => {
      const newLayers = [...prev];
      newLayers[index] = {
        ...newLayers[index],
        k: selectedMaterial.thermalConductivityDry,
        material: selectedMaterial.name,
        state: "seco",
      };
      return newLayers;
    });
  };

  const handleStateChange = (index, state) => {
    setLayers((prev) =>
      prev.map((layer, i) =>
        i === index
          ? {
              ...layer,
              state,
              k:
                state === "seco"
                  ? materials.find((mat) => mat.name === layer.material)
                      ?.thermalConductivityDry || ""
                  : materials.find((mat) => mat.name === layer.material)
                      ?.thermalConductivityWet || "",
            }
          : layer
      )
    );
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

  
  

  const isFormValid = () => {
    if (!deltaT || !hInternal || !hExternal) return false;
    return layers.every(
      (layer) =>
        layer.length &&
        layer.radius1 &&
        layer.radius2 &&
        layer.k &&
        parseFloat(layer.radius2) > parseFloat(layer.radius1)
    );
  };

  const addLayer = () => {
    setLayers((prev) => [
      ...prev,
      { length: "", radius1: "", radius2: "", k: "" },
    ]);
  };

  const removeLayer = (index) => {
    setLayers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCalculate = () => {
    let totalRes = 0;
    let valid = true;

    const rInternal = parseFloat(layers[0]?.radius1);
    const rExternal = parseFloat(layers[layers.length - 1]?.radius2);
    const hInt = parseFloat(hInternal);
    const hExt = parseFloat(hExternal);

    if (isNaN(hInt) || isNaN(hExt) || hInt <= 0 || hExt <= 0) {
      alert("Coeficientes de convecção inválidos");
      return;
    }

    layers.forEach((layer) => {
      const L = parseFloat(layer.length);
      const r1 = parseFloat(layer.radius1);
      const r2 = parseFloat(layer.radius2);
      const kValue = parseFloat(layer.k);

      if (
        isNaN(L) ||
        isNaN(r1) ||
        isNaN(r2) ||
        isNaN(kValue) ||
        L <= 0 ||
        r1 <= 0 ||
        r2 <= r1 ||
        kValue <= 0
      ) {
        valid = false;
        return;
      }

      totalRes += Math.log(r2 / r1) / (2 * Math.PI * kValue * L);
    });

    if (!valid || !deltaT) {
      alert("Valores inválidos ou incompletos.");
      return;
    }

    totalRes += 1 / (2 * Math.PI * hInt * parseFloat(layers[0].length));
    totalRes += 1 / (2 * Math.PI * hExt * parseFloat(layers[0].length));

    const parsedDeltaT = parseFloat(deltaT);
    if (!isNaN(parsedDeltaT)) {
      setTotalResistance(totalRes);
      setHeatFlux((parsedDeltaT / totalRes).toFixed(2));
    }
  };

  const saveToHistory = (totalRes) => {
    const newEntry = {
      deltaT,
      hInternal,
      hExternal,
      totalResistance: Number(totalRes).toFixed(6),
      heatFlux: (parseFloat(deltaT) / totalRes).toFixed(2),
      layers: layers.map((layer) => ({
        material: layer.material || "Desconhecido",
        length: layer.length || "0",
        radius1: layer.radius1 || "0",
        radius2: layer.radius2 || "0",
      })),
      timestamp: new Date().toLocaleString(),
    };

    let storedHistory = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    storedHistory.unshift(newEntry);

    if (storedHistory.length > 3) {
      storedHistory = storedHistory.slice(0, 3);
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedHistory));
    setHistory([...storedHistory]);
  };

  const views = [
    { key: "result", label: "Resultado" },
    { key: "chart", label: "Raio" },
    { key: "bubble", label: "Condutividade" },
  ];

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "50px auto",
        padding: "30px",
        borderRadius: "16px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        backgroundColor: theme.palette.background.paper,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Convecção em Cilindros
      </Typography>

      <TemperatureInput value={deltaT} onChange={(e) => setDeltaT(e.target.value)} />
      <HInternalInput value={hInternal} onChange={(e) => setHInternal(e.target.value)} />
      <HExternalInput value={hExternal} onChange={(e) => setHExternal(e.target.value)} />

      {layers.map((layer, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <CylinderLengthInput value={layer.length} onChange={(e) => handleLayerChange(index, "length", e.target.value)} />
          <InternalRayInput value={layer.radius1} onChange={(e) => handleLayerChange(index, "radius1", e.target.value)} />
          <ExternalRayInput value={layer.radius2} onChange={(e) => handleLayerChange(index, "radius2", e.target.value)} />
          <MaterialSelector
            materials={materials}
            selectedMaterial={layer.material}
            selectedState={layer.state}
            onMaterialChange={(value) => handleMaterialChange(index, value)}
            onStateChange={(value) => handleStateChange(index, value)}
          />
          <IconButton onClick={() => removeLayer(index)}>
            <RemoveCircleIcon />
          </IconButton>
        </Box>
      ))}

      <AddLayerButton onClick={addLayer} />
      <CalculateButton onClick={handleCalculate} isFormValid={isFormValid()} />

      {/* Seletor de visualização */}
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
            Nenhum material válido selecionado.
          </Typography>
        )
      )}

      {activeView === "bubble" && (
        chartData.length > 0 ? (
          <BubbleChart selectedMaterials={chartData} />
        
        ) : (
          <Typography variant="body2" color="text.secondary">
            Nenhum dado válido para exibir os raios.
          </Typography>
        )
      )}

      <History historyData={history} />
    </Box>
  );
};

export default CylindricalConvection;
