import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, useTheme, Button } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import History from "./components/History";
import MaterialSelector from "../materialSelector";
import ResultBox from "../resultBox";
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
import CalculateButton from "../calculateButton";
import AddLayerButton from "../addLayerButton";
import BubbleChart from "../Graphics/BubbleChart";
import TemperatureInput from "../Inputs/Temperature";
import InternalRayInput from "../Inputs/InternalRayInput";
import ExternalRayInput from "../Inputs/ExternalRayInput";
import Cicle from "../../assets/cicle.png";

const SphericalHeatTransfer = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const [layers, setLayers] = useState([{ k: "", r1: "", r2: "", material: "" }]);
  const [deltaT, setDeltaT] = useState("");
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState("0.00");
  const [materials, setMaterials] = useState([]);
  const [view, setView] = useState("result");

  // 🔥 Carregar materiais
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

  // ✅ Handlers
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
              k: selectedMaterial.thermalConductivityDry,
              state: "seco",
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

  // 🔥 Validação
  const isFormValid = () => {
    if (!deltaT || isNaN(parseFloat(deltaT)) || parseFloat(deltaT) <= 0) return false;

    return layers.every((layer) => {
      const k = parseFloat(layer.k);
      const r1 = parseFloat(layer.r1);
      const r2 = parseFloat(layer.r2);

      return (
        !isNaN(k) &&
        k > 0 &&
        !isNaN(r1) &&
        r1 > 0 &&
        !isNaN(r2) &&
        r2 > r1 &&
        layer.material.trim() !== ""
      );
    });
  };

  // 🔥 Calcular
  const calculateResistanceAndHeatFlux = async () => {
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
    const heatFluxValue =
      totalRes > 0 ? (parseFloat(deltaT || 0) / totalRes).toFixed(2) : "0.00";
    setHeatFlux(heatFluxValue);

    await saveToFirestore(totalRes, heatFluxValue);
  };

  // 🔥 Salvar no Firestore
  const saveToFirestore = async (totalRes, heatFluxValue) => {
    if (!user) return;

    const newEntry = {
      userId: user.uid,
      calculatorType: "conduction_spherical",
      deltaT,
      totalResistance: Number(totalRes).toFixed(6),
      heatFlux: heatFluxValue,
      layers: layers.map((layer) => ({
        material: layer.material,
        r1: layer.r1,
        r2: layer.r2,
        state: layer.state || "seco",
        k: layer.k,
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

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "50px auto",
        padding: "30px",
        borderRadius: "16px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: theme.palette.background.paper,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Condução em Estruturas Esféricas
      </Typography>
      <Box component="img" src={Cicle} sx={{ width: 80, height: 80 }} />

      <TemperatureInput
        value={deltaT}
        onChange={(e) => handleNumericInput(e.target.value, setDeltaT)}
      />

      {layers.map((layer, index) => (
        <Box
          key={index}
          sx={{ marginBottom: "15px", marginTop: "35px", textAlign: "center" }}
        >
          <InternalRayInput
            value={layer.r1}
            onChange={(e) => handleLayerChange(index, "r1", e.target.value)}
          />
          <ExternalRayInput
            value={layer.r2}
            onChange={(e) => handleLayerChange(index, "r2", e.target.value)}
            error={parseFloat(layer.r1) >= parseFloat(layer.r2)}
            helperText={
              parseFloat(layer.r1) >= parseFloat(layer.r2)
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
          <Typography>
            Condutividade térmica (k):{" "}
            <strong>{layer.k ? `${layer.k} W/m.K` : "Selecione um material"}</strong>
          </Typography>
          <IconButton onClick={() => removeLayer(index)} sx={{ color: "#9b00d9" }}>
            <RemoveCircleIcon />
          </IconButton>
        </Box>
      ))}

      <AddLayerButton onClick={addLayer} />
      <CalculateButton
        onClick={calculateResistanceAndHeatFlux}
        isFormValid={isFormValid()}
      />

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

      {view === "chart" && layers.length > 0 && (
        <BubbleChart selectedMaterials={layers} />
      )}

      {view === "result" && (
        <ResultBox totalResistance={totalResistance} heatFlux={heatFlux} />
      )}

      <History />
    </Box>
  );
};

export default SphericalHeatTransfer;
