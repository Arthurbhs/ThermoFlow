import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, useTheme, Button } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import History from "./components/History";
import MaterialSelector from "../materialSelector";
import ResultBox from "../resultBox";
import CalculateButton from "../calculateButton";
import AddLayerButton from "../addLayerButton";
import { collection, getDocs, query, where, onSnapshot, addDoc, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../AuthContext";
import ThermalConductivityChart from "../Graphics/ThermalCondutivityChartPlane";
import CalculatorInput from "../Inputs/CalculatorInput";
import Squadre from "../../assets/squadre.png";
import SlideTutorial from "../TutorialSlider"


const HeatTransferCalculator = () => {
  const theme = useTheme();
  const [layers, setLayers] = useState([{ h: "", a: 1, material: "", state: "seco" }]);
  const [deltaT, setDeltaT] = useState("");
  const [area, setArea] = useState(1);
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState("0.00");
  const [history, setHistory] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [viewMode, setViewMode] = useState("resultado");
  const { user } = useAuth();

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
        alert("Erro ao carregar materiais.");
      }
    };

    if (user) fetchMaterials();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "history"),
      where("userId", "==", user.uid),
      where("calculatorType", "==", "condution_planar"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(data);
    });

    return () => unsubscribe();
  }, [user]);

const handleNumericInput = (value, setter) => {
  const sanitized = value.replace(/[^0-9.]/g, "").replace(/^([0-9]*\.?[0-9]*).*$/, "$1");
  const numericValue = parseFloat(sanitized) || 0;
  setter(numericValue);
};


  const handleLayerChange = (index, key, value) => {
    setLayers(prev => prev.map((layer, i) => i === index ? { ...layer, [key]: value } : layer));
  };

  const calculateResistance = () => {
    let total = layers.reduce((acc, { h, a, material, state }) => {
      const selectedMaterial = materials.find(m => m.name === material);
      if (!selectedMaterial) return acc;

      const conductivity = state === "seco" ? selectedMaterial.thermalConductivityDry : selectedMaterial.thermalConductivityWet;
      return acc + parseFloat(h) / (conductivity * parseFloat(a));
    }, 0);

    setTotalResistance(total);
  };

  useEffect(() => {
    if (totalResistance > 0) calculateHeatFlux();
  }, [totalResistance]);

  const calculateHeatFlux = () => {
    const deltaTValue = parseFloat(deltaT);
    if (totalResistance > 0) {
      setHeatFlux((deltaTValue / totalResistance).toFixed(5));
      saveToHistory((deltaTValue / totalResistance).toFixed(5), totalResistance);
    }
  };

  const saveToHistory = async (heatFluxValue, totalRes) => {
    if (!user) return;

    const newEntry = {
      userId: user.uid,
      calculatorType: "condution_planar",
      deltaT,
      area,
      layers,
      totalResistance: Number(totalRes).toFixed(6),
      heatFlux: heatFluxValue,
      timestamp: new Date()
    };

    try {
      await addDoc(collection(db, "history"), newEntry);
    } catch (error) {
      console.error("Erro ao salvar no Firestore:", error);
    }
  };

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
console.log("chartData", chartData.map(({ material, length, area, thermalConductivity }) => ({
  material,
  length,
  area,
  thermalConductivity
})));




  const addLayer = () => setLayers([...layers, { h: "", a: area, material: "", state: "seco" }]);
  const removeLayer = (index) => setLayers(layers.filter((_, i) => i !== index));
  const isFormValid = () => deltaT && parseFloat(deltaT) > 0 && layers.every(layer => layer.h && layer.a && layer.material);

  return (
    <Box sx={{ maxWidth: 600, margin: "50px auto", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: theme.palette.background.paper, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>Condução em estruturas quadradas</Typography>
       {user && <SlideTutorial user={user} />}

      <Box component="img" src={Squadre} sx={{ width: 80, height: 80, objectFit: "cover" }} />
      <CalculatorInput label="Diferença de Temperatura (ΔT em K)" value={deltaT} onChange={(e) => handleNumericInput(e.target.value, setDeltaT)} 
        description=" Diferença entre as temperaturas entre o objeto a outro, ou o objeto e o ambiente que impulsiona a troca de calor "/>

      {layers.map((layer, index) => (
        <Box key={index} sx={{ marginBottom: 2 }}>
          <MaterialSelector
            materials={materials}
            selectedMaterial={layer.material}
            selectedState={layer.state}
            onMaterialChange={(value) => handleLayerChange(index, "material", value)}
            onStateChange={(value) => handleLayerChange(index, "state", value)}
          />
          <CalculatorInput label="Espessura (M)" value={layer.h} onChange={(e) => handleNumericInput(e.target.value, (val) => handleLayerChange(index, "h", val))}
          description="   refere-se à distância entre duas superfícies opostas de um objeto ou material, em metros."/>

          <CalculatorInput label="Área (M²)" value={layer.a} onChange={(e) => handleNumericInput(e.target.value, (val) => handleLayerChange(index, "a", val))} 
           description=" A área corresponde à superfície da parede onde ocorre a troca de calor. Insira o valor em metros quadrados."/>
          <IconButton onClick={() => removeLayer(index)} sx={{ color: "#9b00d9" }}><RemoveCircleIcon /></IconButton>
        </Box>
      ))}

      <AddLayerButton onClick={addLayer} />
      <CalculateButton onClick={calculateResistance} isFormValid={isFormValid()} />

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
        <Button variant={viewMode === "resultado" ? "contained" : "outlined"} onClick={() => setViewMode("resultado")} color="primary">Ver Resultado</Button>
        <Button variant={viewMode === "grafico" ? "contained" : "outlined"} onClick={() => setViewMode("grafico")} color="secondary">Ver Gráfico</Button>
      </Box>

      {viewMode === "resultado" ? (
        <ResultBox totalResistance={totalResistance} heatFlux={heatFlux} />
      ) : (
        <ThermalConductivityChart selectedMaterials={chartData} />
      )}

      <History historyData={history} />
    </Box>
    
  );
};

export default HeatTransferCalculator;
