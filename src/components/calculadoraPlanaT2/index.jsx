import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, useTheme, Button } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import History from "./components/History";
import MaterialSelector from "../materialSelector";
import ResultBox from "../resultBox";
import CalculateButton from "../calculateButton";
import AddLayerButton from "../addLayerButton";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../AuthContext";
import TurorialLabel from "../TutorialLabel"
import CalculatorInput from "../Inputs/CalculatorInput";
import SlideTutorial from "../TutorialSlider"

import ThermalConductivityChartPlane from "../Graphics/ThermalCondutivityChartPlane";
import Squadre from "../../assets/squadre.png";

const HeatTransferCalculator = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const [deltaT, setDeltaT] = useState("");
  const [hInternal, setHInternal] = useState("");
  const [hExternal, setHExternal] = useState("");

  const [layers, setLayers] = useState([{ h: "1", a: "1", material: "", state: "seco" }]);
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState("0.00");
  const [history, setHistory] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [viewMode, setViewMode] = useState("resultado");

  // 🔥 Salvar entrada no Firestore
  const saveToFirestoreHistory = async (entry) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "history"), {
        userId: user.uid,
        calculatorType: "convection_planar",
        ...entry,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao salvar no Firestore:", error);
    }
  };

  // 🔄 Buscar histórico do Firestore
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const historyRef = collection(db, "history");
        const q = query(historyRef, where("userId", "==", user.uid), where("calculatorType", "==", "convection_planar"));
        const querySnapshot = await getDocs(q);
        const userHistory = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHistory(userHistory);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      }
    };
    fetchHistory();
  }, [user]);

  // 🔄 Buscar materiais da API + Firestore
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch("https://minha-api-workers.apimateriallistcalculator.workers.dev/src/index");
        const apiMaterials = await response.json();

        const materialsRef = collection(db, "user_materials");
        const q = query(materialsRef, where("userId", "==", user?.uid));
        const querySnapshot = await getDocs(q);
        const userMaterials = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setMaterials([...apiMaterials, ...userMaterials]);
      } catch (error) {
        console.error("Erro ao carregar materiais:", error);
        alert("Erro ao carregar materiais. Verifique sua conexão ou permissões.");
      }
    };

    if (user) fetchMaterials();
  }, [user]);

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
    const sanitized = value.replace(/[^0-9.]/g, "").replace(/^([0-9]*\.?[0-9]*).*$/, "$1");
    setter(sanitized);
  };

  const handleLayerChange = (index, key, value) => {
    setLayers(prev => prev.map((layer, i) => i === index ? { ...layer, [key]: value } : layer));
  };

  const calculateResistance = () => {
    let total = 0;

   layers.forEach(({ h, a, material, state }) => {
  const selectedMaterial = materials.find(m => m.name === material);
  if (!selectedMaterial) return;

  const thermalConductivity = state === "seco"
    ? selectedMaterial.thermalConductivityDry || selectedMaterial.conductivityDry
    : selectedMaterial.thermalConductivityWet || selectedMaterial.conductivityWet;

  const thickness = parseFloat(h);
  const areaValue = parseFloat(a); // ✅ Correção aqui

  if (!isNaN(thickness) && !isNaN(areaValue) && thermalConductivity > 0) {
    total += thickness / (thermalConductivity * areaValue);
  }
});


    const hInt = parseFloat(hInternal);
    const hExt = parseFloat(hExternal);
const area = parseFloat(layers[0]?.a || "1"); // fallback para 1 se vazio

if (!isNaN(hInt) && hInt > 0) total += 1 / (hInt * area);
if (!isNaN(hExt) && hExt > 0) total += 1 / (hExt * area);



    setTotalResistance(total);
  };

  const calculateHeatFlux = () => {
    const deltaTValue = parseFloat(deltaT);
    setHeatFlux(totalResistance > 0 ? (deltaTValue / totalResistance).toFixed(5) : "0.00");
  };

  const saveToHistory = () => {
    const newEntry = {
      deltaT,
      hInternal,
      hExternal,
      layers,
      totalResistance,
      heatFlux,
    };
    saveToFirestoreHistory(newEntry);
  };

  const addLayer = () => setLayers([...layers, { h: "", a: "", material: "", state: "seco" }]);
  const removeLayer = (index) => layers.length > 1 && setLayers(layers.filter((_, i) => i !== index));

  const isFormValid = () =>
    deltaT &&
    parseFloat(deltaT) > 0 &&
    layers.every(layer => layer.h && layer.a && layer.material) &&
    hInternal &&
    hExternal;

  const chartData = layers.map((layer) => {
  const selectedMaterial = materials.find(m => m.name === layer.material);
  const thermalConductivity = selectedMaterial
    ? (layer.state === "seco" ? selectedMaterial.thermalConductivityDry : selectedMaterial.thermalConductivityWet)
    : null;

  return thermalConductivity ? {
    material: layer.material,
    thermalConductivity,
    length: parseFloat(layer.h) || 0,
    area: parseFloat(layer.a) || 0
  } : null;
}).filter(Boolean);

  return (
    <Box sx={{
      maxWidth: 600,
      margin: "50px auto",
      padding: "30px",
      borderRadius: "16px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      backgroundColor: theme.palette.background.paper,
      textAlign: "center"
    }}>
      <Typography variant="h4" gutterBottom>Convecção em estruturas quadradas</Typography>
        {user && <SlideTutorial user={user} />}

      <Box component="img" src={Squadre} sx={{ width: 80, height: 80 }} />

     <CalculatorInput label="Diferença de Temperatura (ΔT em K)" value={deltaT} onChange={(e) => handleNumericInput(e.target.value, setDeltaT)} 
            description=" Diferença entre as temperaturas entre o objeto a outro, ou o objeto e o ambiente que impulsiona a troca de calor "/>
      <CalculatorInput label="Coeficiente de Convecção Interno (W/m².K)" value={hInternal} onChange={(e) => handleNumericInput(e.target.value, setHInternal)} 
      description="  Mede a troca de calor na superfície interna com o fluido interno. Varia com o tipo de fluido e fluxo. (W/m²·K)"  
            />
      <CalculatorInput label="Coeficiente de Convecção Externo (W/m².K)" value={hExternal} onChange={(e) => handleNumericInput(e.target.value, setHExternal)} 
      description="    Mede a troca de calor entre a superfície externa e o ar. Varia com o vento e a temperatura. (W/m²·K)"/>

      <Typography variant="h6" gutterBottom>Camadas</Typography>

      {layers.map((layer, index) => (
        <Box key={index} sx={{ marginBottom: "15px", marginTop: "35px", textAlign: "center", flexGrow: 1 }}>
          <MaterialSelector
            materials={materials}
            selectedMaterial={layer.material}
            selectedState={layer.state}
            onMaterialChange={(value) => handleLayerChange(index, "material", value)}
            onStateChange={(value) => handleLayerChange(index, "state", value)}
          />
          <CalculatorInput label="Área (M²)"   value={layer.a} onChange={(e) => handleNumericInput(e.target.value, (val) => handleLayerChange(index, "a", val))}
          description=" A área corresponde à superfície da parede onde ocorre a troca de calor. Insira o valor em metros quadrados."/>
                
                   
         <CalculatorInput label="Espessura (M)" value={layer.h} onChange={(e) => handleNumericInput(e.target.value, (val) => handleLayerChange(index, "h", val))}
                  description="   refere-se à distância entre duas superfícies opostas de um objeto ou material, em metros."/>
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
        <ThermalConductivityChartPlane selectedMaterials={chartData} />
      )}

      <History historyData={history} />
    </Box>
  );
};

export default HeatTransferCalculator;
