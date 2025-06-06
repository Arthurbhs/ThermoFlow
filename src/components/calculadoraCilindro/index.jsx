import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, useTheme, Button } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import History from "./componentes/History";
import MaterialSelector from "../materialSelector";
import ResultBox from "../resultBox";
import CalculateButton from "../calculateButton";
import AddLayerButton from "../addLayerButton";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../AuthContext";
import ThermalConductivityChart from "../Graphics/ThermalConductivityChart";
import TemperatureInput from "../Inputs/Temperature";
import CylinderLengthInput from "../Inputs/CylinderLengthInput";
import InternalRayInput from "../Inputs/InternalRayInput";
import ExternalRayInput from "../Inputs/ExternalRayInput";
import BubbleChart from "../Graphics/BubbleChart";
import Cilindric from "../../assets/cilindric.png";

const CylindricalConduction = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const [deltaT, setDeltaT] = useState("");
  const [layers, setLayers] = useState([{ length: "", radius1: "", radius2: "", k: "" }]);
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState(0);
  const [materials, setMaterials] = useState([]);
  const [activeView, setActiveView] = useState("result");

  // 🔥 Buscar materiais
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch("https://minha-api-workers.apimateriallistcalculator.workers.dev/src/index");
        const apiMaterials = await response.json();

        const materialsRef = collection(db, "user_materials");
        const q = query(materialsRef, where("userId", "==", user?.uid));
        const querySnapshot = await getDocs(q);

        const userMaterials = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMaterials([...apiMaterials, ...userMaterials]);
      } catch (error) {
        console.error("Erro ao carregar materiais:", error);
      }
    };

    if (user) fetchMaterials();
  }, [user]);

  // 🔢 Chart data
  const chartData = layers
    .map(layer => ({
      material: layer.material || "Desconhecido",
      k: parseFloat(layer.k) || 0,
      length: parseFloat(layer.length) || 0,
      r1: parseFloat(layer.radius1) || 0,
      r2: parseFloat(layer.radius2) || 0,
    }))
    .filter(layer => layer.material);

  // ✅ Validação
  const isFormValid = () => {
    if (!deltaT) return false;
    return layers.every(layer =>
      layer.length && layer.radius1 && layer.radius2 && layer.k &&
      parseFloat(layer.radius2) > parseFloat(layer.radius1)
    );
  };

  // 🔢 Handlers
  const handleLayerChange = (index, field, value) => {
    if (/^-?\d*\.?\d*$/.test(value)) {
      setLayers(prev =>
        prev.map((layer, i) => (i === index ? { ...layer, [field]: value } : layer))
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
        k: selectedMaterial.thermalConductivityDry,
        material: selectedMaterial.name,
        state: "seco",
      };
      return newLayers;
    });
  };

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

  const addLayer = () => {
    setLayers(prev => [...prev, { length: "", radius1: "", radius2: "", k: "" }]);
  };

  const removeLayer = (index) => {
    setLayers(prev => prev.filter((_, i) => i !== index));
  };

  // 🔥 Cálculo
  const handleCalculate = async () => {
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
        const heat = (parsedDeltaT / totalRes).toFixed(2);
        setTotalResistance(totalRes);
        setHeatFlux(heat);
        await saveToFirestore(totalRes, heat);
      }
    } else {
      alert("Erro: Verifique os valores.");
    }
  };

  // 🔥 Salvar no Firestore
  const saveToFirestore = async (totalRes, heat) => {
    if (!user) return;

    const newEntry = {
      userId: user.uid,
      calculatorType: "conduction_cylindrical",
      deltaT,
      totalResistance: Number(totalRes).toFixed(6),
      heatFlux: heat,
      layers: layers.map(layer => ({
        material: layer.material || "Desconhecido",
        state: layer.state || "seco",
        length: layer.length || "0",
        radius1: layer.radius1 || "0",
        radius2: layer.radius2 || "0",
        k: layer.k || "0",
      })),
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "history"), newEntry);
      console.log("Cálculo salvo no Firestore.");
    } catch (error) {
      console.error("Erro ao salvar no Firestore:", error);
    }
  };

  const views = [
    { key: "result", label: "Resultado" },
    { key: "chart", label: "Condutividade" },
    { key: "bubble", label: "Raios" },
  ];

  return (
    <Box sx={{ maxWidth: 500, margin: "50px auto", padding: "30px", borderRadius: "16px", backgroundColor: theme.palette.background.paper }}>
      <Typography variant="h4" gutterBottom>
        Condução em estruturas Cilindricas
      </Typography>

      <Box component="img" src={Cilindric} sx={{ width: 80, height: 80 }} />

      <TemperatureInput value={deltaT} onChange={(e) => setDeltaT(e.target.value)} />

      {layers.map((layer, index) => (
        <Box key={index} sx={{ marginBottom: "15px", marginTop: "35px" }}>
          <CylinderLengthInput value={layer.length} onChange={(e) => handleLayerChange(index, "length", e.target.value)} />
          <InternalRayInput value={layer.radius1} onChange={(e) => handleLayerChange(index, "radius1", e.target.value)} />
          <ExternalRayInput
            value={layer.radius2}
            onChange={(e) => handleLayerChange(index, "radius2", e.target.value)}
            error={parseFloat(layer.radius1) >= parseFloat(layer.radius2)}
            helperText={parseFloat(layer.radius1) >= parseFloat(layer.radius2) ? "Raio externo deve ser maior que o interno" : ""}
          />
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

      {activeView === "result" && <ResultBox totalResistance={totalResistance} heatFlux={heatFlux} />}

      {activeView === "chart" && (chartData.length > 0 ? <ThermalConductivityChart selectedMaterials={chartData} /> : <Typography variant="body2">Nenhum material válido.</Typography>)}

      {activeView === "bubble" && (chartData.length > 0 ? <BubbleChart selectedMaterials={chartData} /> : <Typography variant="body2">Nenhum dado válido.</Typography>)}

      <History />
    </Box>
  );
};

export default CylindricalConduction;
