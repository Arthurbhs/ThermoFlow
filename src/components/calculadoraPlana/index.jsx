import React, { useState, useEffect } from "react";
import { 
  Box, TextField, Button, Typography, IconButton, MenuItem, Select, FormControl, 
  InputLabel, useTheme 
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import History from "./components/History";


const materials = [
  { name: "Selecione um material", value: "" },
  { name: "Ar", value: 10 },
  { name: "Água", value: 500 },
  { name: "Óleo", value: 50 },
  { name: "Ar em Movimento", value: 25 },
  { name: "Superfície Metálica", value: 100 },
  { name: "Superfície Plástica", value: 5 },
];

const HeatTransferCalculator = () => {
  const theme = useTheme();
  const [layers, setLayers] = useState([{ h: "", a: 1, material: "" }]);
  const [deltaT, setDeltaT] = useState("");
  const [area, setArea] = useState(1);
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState("0.00");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("heatTransferHistory")) || [];
    setHistory(savedHistory);
  }, []);
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
  
  

  const saveToHistory = () => {
    const newEntry = {
      deltaT,
      area,
      layers: layers.map(layer => ({
        material: layer.material,
        h: layer.h,
        a: layer.a
      })), 
      totalResistance: typeof totalResistance === "number" ? totalResistance : 0,
      heatFlux,
      timestamp: new Date().toLocaleString(),
    };
  
    const updatedHistory = [newEntry, ...history.slice(0, 2)]; // Mantém apenas os 3 últimos cálculos
    setHistory(updatedHistory);
    localStorage.setItem("heatTransferHistory", JSON.stringify(updatedHistory));
  };
  

  useEffect(() => {
    setLayers((prev) => prev.map((layer) => ({ ...layer, a: area })));
  }, [area]);

 
  const calculateResistance = () => {
    let total = layers.reduce((acc, layer) => {
      const h = parseFloat(layer.h);
      const a = parseFloat(layer.a);
      return isNaN(h) || isNaN(a) || h <= 0 || a <= 0 ? acc : acc + (1 / (h * a));
    }, 0);
    setTotalResistance(total);
  };

  const calculateHeatFlux = () => {
    const deltaTValue = parseFloat(deltaT);
    if (isNaN(deltaTValue) || deltaTValue <= 0 || totalResistance <= 0) {
      setHeatFlux("0.00");
      return;
    }
    const flux = (deltaTValue / totalResistance).toFixed(5);
    setHeatFlux(flux);
    saveToHistory();
  };
  
  
 
  
  const isFormValid = () => {
    if (!deltaT || !area || parseFloat(deltaT) <= 0 || parseFloat(area) <= 0) return false;
    
    for (let layer of layers) {
      if (!layer.material || !layer.h || parseFloat(layer.h) <= 0 || parseFloat(layer.a) <= 0) {
        return false;
      }
    }
    return true;
  }


  const handleInputChange = (setter) => (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "").replace(/^(\d*\.\d*)\./g, "$1");
    setter(value === "" || isNaN(parseFloat(value)) ? "" : value);
  };


  const handleLayerAreaChange = (index, event) => {
    const value = event.target.value.replace(/[^0-9.]/g, "").replace(/^(\d*\.\d*)\./g, "$1");
    setLayers((prev) => {
      const newLayers = [...prev];
      newLayers[index] = { ...newLayers[index], a: value === "" || isNaN(parseFloat(value)) ? "" : value };
      return newLayers;
    });
  };
  

  const handleMaterialChange = (index, value) => {
    const selectedMaterial = materials.find((mat) => mat.name === value);
    if (!selectedMaterial) return;

    setLayers((prev) => {
      const newLayers = [...prev];
      newLayers[index] = { ...newLayers[index], h: selectedMaterial.value, material: value };
      return newLayers;
    });
  };

  const addLayer = () => {
    setLayers([...layers, { h: "", a: area, material: "" }]);
  };

  const removeLayer = (index) => {
    if (layers.length > 1) {
      setLayers(layers.filter((_, i) => i !== index));
    }
  };
  console.log(history);
  
  return (
    <Box sx={{ maxWidth: 600, margin: "50px auto", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: theme.palette.background.paper, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Transferência de Calor por Convecção
      </Typography>

      <TextField 
        label="Diferença de Temperatura (ΔT em K)" 
        type="text" 
        value={deltaT} 
        onChange={handleInputChange(setDeltaT)} 
        fullWidth 
        margin="normal" 
      />

   
      <Typography variant="h6" gutterBottom>Camadas</Typography>
      {layers.map((layer, index) => (
        <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
       <TextField 
  label="Área (m²)" 
  type="text" 
  value={layer.a} 
  onChange={(e) => handleLayerAreaChange(index, e)} 
  fullWidth 
  margin="normal" 
/>


          <FormControl fullWidth>
            <InputLabel>Material</InputLabel>
            <Select value={layer.material} onChange={(e) => handleMaterialChange(index, e.target.value)}>
              {materials.map((mat, i) => (
                <MenuItem key={i} value={mat.name}>{mat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body1">
            Coeficiente de convecção (h): <strong>{layer.h ? `${layer.h} W/m²K` : "Selecione um material"}</strong>
          </Typography>
          <IconButton onClick={() => removeLayer(index)} sx={{ color: "#9b00d9" }}>
            <RemoveCircleIcon />
          </IconButton>
        </Box>
      ))}

      <Button 
        variant="outlined" 
        onClick={addLayer} 
        startIcon={<AddCircleIcon />} 
        sx={{ marginBottom: "10px", color: "#7300ff", borderColor: "#7300ff", "&:hover": { backgroundColor: "#7300ff", color: "white" } }}
      >
        Adicionar Camada
      </Button>

      <Button 
  variant="contained" 
  onClick={calculateResistance} 
  disabled={!isFormValid()} 
  sx={{ display: "block", margin: "10px auto", backgroundColor: isFormValid() ? "#007BFF" : "#ccc", "&:hover": { backgroundColor: isFormValid() ? "#0056b3" : "#ccc" } }}
>
  Calcular
</Button>




      <Box sx={{ marginTop: "20px", padding: "15px", borderRadius: "8px", backgroundColor: theme.palette.background.paper}}>
        <Typography variant="h6">Resultados</Typography>
        <TextField label="Resistência Térmica Total (K/W)" value={totalResistance.toFixed(6)} fullWidth margin="normal" InputProps={{ readOnly: true }} />
        <TextField label="Fluxo de Calor (Q) em Watts" value={heatFlux} fullWidth margin="normal" InputProps={{ readOnly: true }} />
      </Box>
      <History historyData={history}/>

    </Box>
  );
};

export default HeatTransferCalculator;
