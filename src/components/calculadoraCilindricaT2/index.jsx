import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import History from "./components/History";
import ResultBox from "../resultBox";
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
  const [deltaT, setDeltaT] = useState("");
  const [hInternal, setHInternal] = useState("");
  const [hExternal, setHExternal] = useState("");
  const [materials, setMaterials] = useState([]);
  const [layers, setLayers] = useState([{ length: "", rInternal: "", rExternal: "", material: "", state: "seco" }]);
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState("0.00");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("https://materialsapi.onrender.com/materials")
      .then(response => response.json())
      .then(data => setMaterials(data))
      .catch(error => console.error("Erro ao buscar materiais:", error));
  }, []);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("ConvCilHistory")) || [];
    setHistory(storedHistory);
  }, []);

  useEffect(() => {
    if (totalResistance > 0 && heatFlux !== "0.00") {
      saveToHistory();
    }
  }, [totalResistance, heatFlux]);

  const saveToHistory = () => {
    const newEntry = {
      deltaT,
      hInternal,
      hExternal,
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

  const handleLayerChange = (index, field, value) => {
    setLayers(prevLayers =>
      prevLayers.map((layer, i) => (i === index ? { ...layer, [field]: value } : layer))
    );
  };

  const handleNumericInput = (value, setter) => {
    if (typeof value !== "string") return;
  
    // Permite número parcial como "0.", "1.2", etc.
    const sanitizedValue = value.replace(/[^0-9.]/g, "");
  
    // Evita múltiplos pontos flutuantes
    const parts = sanitizedValue.split(".");
    const safeValue = parts.length > 2 ? parts[0] + "." + parts[1] : sanitizedValue;
  
    setter(safeValue);
  };
  

  const handleCalculate = () => {
    let totalRes = 0;

    layers.forEach(layer => {
      const L = parseFloat(layer.length);
      const rInternal = parseFloat(layer.rInternal);
      const rExternal = parseFloat(layer.rExternal);

      const selectedMaterial = materials.find(m => m.name === layer.material);
      const thermalConductivity = layer.state === "seco"
        ? selectedMaterial?.thermalConductivityDry
        : selectedMaterial?.thermalConductivityWet;

      if (!isNaN(L) && !isNaN(rInternal) && !isNaN(rExternal) &&
          L > 0 && rInternal > 0 && rExternal > rInternal && thermalConductivity) {

        // Resistência térmica por condução
        const Rcond = Math.log(rExternal / rInternal) / (2 * Math.PI * L * thermalConductivity);
        totalRes += Rcond;
      }
    });

    const L = parseFloat(layers[0].length);
    const rInternal = parseFloat(layers[0].rInternal);
    const rExternal = parseFloat(layers[layers.length - 1].rExternal);
    const hInt = parseFloat(hInternal);
    const hExt = parseFloat(hExternal);

    if (!isNaN(hInt) && !isNaN(L) && hInt > 0) {
      totalRes += 1 / (hInt * 2 * Math.PI * rInternal * L);
    }
    if (!isNaN(hExt) && !isNaN(L) && hExt > 0) {
      totalRes += 1 / (hExt * 2 * Math.PI * rExternal * L);
    }

    setTotalResistance(totalRes);
    setHeatFlux(totalRes > 0 ? (parseFloat(deltaT || 0) / totalRes).toFixed(2) : "0.00");
  };

  const isFormValid = () => {
    if (!deltaT || isNaN(parseFloat(deltaT)) || !hInternal || !hExternal || isNaN(parseFloat(hInternal)) || isNaN(parseFloat(hExternal))) {
      return false;
    }
    return layers.every(layer => 
      layer.length && layer.rInternal && layer.rExternal && layer.material &&
      !isNaN(parseFloat(layer.length)) &&
      !isNaN(parseFloat(layer.rInternal)) &&
      !isNaN(parseFloat(layer.rExternal)) &&
      parseFloat(layer.rExternal) > parseFloat(layer.rInternal)
    );
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "50px auto", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: theme.palette.background.paper, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Transferência de Calor em Estruturas Cilíndricas
      </Typography>

    <TemperatureInput value={deltaT} onChange={(val) => handleNumericInput(val.target.value, setDeltaT)} />
    <HInternalInput value={hInternal} onChange={(e) => handleNumericInput(e.target.value, setHInternal)} />
    <HExternalInput value={hExternal} onChange={(val) => handleNumericInput(val.target.value, setHExternal)} />

      {layers.map((layer, index) => (
        <Box key={index} sx={{ marginBottom: "15px", textAlign: "center" }}>
          <MaterialSelector
            materials={materials}
            selectedMaterial={layer.material}
            selectedState={layer.state}
            onMaterialChange={(value) => handleLayerChange(index, "material", value)}
            onStateChange={(value) => handleLayerChange(index, "state", value)}
          />

<CylinderLengthInput value={layer.length} onChange={(e) => handleLayerChange(index, "length", e.target.value)}/>
            <InternalRayInput value={layer.radius1} onChange={(e) => handleLayerChange(index, "rInternal", e.target.value)} />
            <ExternalRayInput value={layer.radius2} onChange={(e) => handleLayerChange(index, "rExternal", e.target.value)} />
          

          <IconButton onClick={() => setLayers(layers.filter((_, i) => i !== index))} sx={{ color: "#9b00d9" }}>
            <RemoveCircleIcon />
          </IconButton>
        </Box>
      ))}

      <AddLayerButton onClick={() => setLayers([...layers, { length: "", rInternal: "", rExternal: "", material: "", state: "seco" }])} />
      <CalculateButton onClick={handleCalculate} isFormValid={isFormValid()} />
      <ResultBox totalResistance={totalResistance} heatFlux={heatFlux} />
      <History historyData={history} />
    </Box>
  );
};

export default CylindricalConvection;
