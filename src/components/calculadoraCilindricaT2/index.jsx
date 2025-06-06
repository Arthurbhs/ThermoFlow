import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, useTheme, Button } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import History from "./components/History";
import ResultBox from "../resultBox";
import BubbleChart from "../Graphics/BubbleChart";
import ThermalConductivityChart from "../Graphics/ThermalConductivityChart";
import CalculateButton from "../calculateButton";
import AddLayerButton from "../addLayerButton";
import MaterialSelector from "../materialSelector";
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
import SlideTutorial from "../TutorialSlider"
import TemperatureInput from "../Inputs/Temperature";
import HInternalInput from "../Inputs/InternalConvectionCoefficient";
import HExternalInput from "../Inputs/ExternalConvectionCoefficient";
import ExternalRayInput from "../Inputs/ExternalRayInput";
import InternalRayInput from "../Inputs/InternalRayInput";
import CylinderLengthInput from "../Inputs/CylinderLengthInput";

import Cilindric from "../../assets/cilindric.png";

const CylindricalConvection = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const [deltaT, setDeltaT] = useState("");
  const [hInternal, setHInternal] = useState("");
  const [hExternal, setHExternal] = useState("");
  const [layers, setLayers] = useState([
    { length: "", radius1: "", radius2: "", k: "" },
  ]);
  const [materials, setMaterials] = useState([]);
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState(0);
  const [activeView, setActiveView] = useState("result");

  // 🔥 Carregar materiais da API + Firestore
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch(
          "https://minha-api-workers.apimateriallistcalculator.workers.dev/src/index"
        );
        const apiMaterials = await response.json();

        const materialsRef = collection(db, "user_materials");
        const q = query(materialsRef, where("userId", "==", user?.uid));

        const querySnapshot = await getDocs(q);
        const userMaterials = querySnapshot.docs.map((doc) => ({
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
    .map((layer) => ({
      material: layer.material || "Desconhecido",
      k: parseFloat(layer.k) || 0,
      length: parseFloat(layer.length) || 0,
      r1: parseFloat(layer.radius1) || 0,
      r2: parseFloat(layer.radius2) || 0,
    }))
    .filter((layer) => layer.material);

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

  const handleCalculate = async () => {
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
      const heat = (parsedDeltaT / totalRes).toFixed(2);
      setTotalResistance(totalRes);
      setHeatFlux(heat);
      await saveToFirestore(totalRes, heat);
    }
  };

  const saveToFirestore = async (totalRes, heat) => {
    if (!user) return;

    const newEntry = {
      userId: user.uid,
      calculatorType: "convection_cylindrical", // 🔥 Tipo da calculadora
      deltaT,
      hInternal,
      hExternal,
      totalResistance: Number(totalRes).toFixed(6),
      heatFlux: heat,
      layers: layers.map((layer) => ({
        material: layer.material || "Desconhecido",
        state: layer.state || "seco",
        k: layer.k || "0",
        length: layer.length || "0",
        radius1: layer.radius1 || "0",
        radius2: layer.radius2 || "0",
      })),
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "history"), newEntry);
      console.log("Salvo no Firestore.");
    } catch (error) {
      console.error("Erro ao salvar no Firestore:", error);
    }
  };

  const views = [
    { key: "result", label: "Resultado" },
    { key: "chart", label: "Condutividade" },
    { key: "ChatRay", label: "Raio" },
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
        Convecção em estruturas Cilindricas
      </Typography>
       <SlideTutorial/>
      <Box component="img" src={Cilindric} sx={{ width: 80, height: 80 }} />

      <TemperatureInput value={deltaT} onChange={(e) => setDeltaT(e.target.value)} />
      <HInternalInput value={hInternal} onChange={(e) => setHInternal(e.target.value)} />
      <HExternalInput value={hExternal} onChange={(e) => setHExternal(e.target.value)} />

      {layers.map((layer, index) => (
        <Box key={index} sx={{ marginBottom: "15px", marginTop: "35px" }}>
          <CylinderLengthInput
            value={layer.length}
            onChange={(e) => handleLayerChange(index, "length", e.target.value)}
          />
          <InternalRayInput
            value={layer.radius1}
            onChange={(e) => handleLayerChange(index, "radius1", e.target.value)}
          />
          <ExternalRayInput
            value={layer.radius2}
            onChange={(e) => handleLayerChange(index, "radius2", e.target.value)}
            error={parseFloat(layer.radius1) >= parseFloat(layer.radius2)}
            helperText={
              parseFloat(layer.radius1) >= parseFloat(layer.radius2)
                ? "Raio externo deve ser maior que o interno"
                : ""
            }
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

      {activeView === "result" && (
        <ResultBox totalResistance={totalResistance} heatFlux={heatFlux} />
      )}

      {activeView === "chart" && (
        chartData.length > 0 ? (
          <ThermalConductivityChart selectedMaterials={chartData} />
        ) : (
          <Typography variant="body2">Nenhum material válido selecionado.</Typography>
        )
      )}

      {activeView === "ChatRay" && (
        chartData.length > 0 ? (
          <BubbleChart selectedMaterials={chartData} />
        ) : (
          <Typography variant="body2">Nenhum dado válido para exibir os raios.</Typography>
        )
      )}

      <History />
    </Box>
  );
};

export default CylindricalConvection;
