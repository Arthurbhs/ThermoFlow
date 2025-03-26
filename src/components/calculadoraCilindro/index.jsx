import React, { useState, useEffect} from "react";
import {Box,TextField,Button,Typography,IconButton,useTheme,MenuItem,Select,InputLabel,FormControl,} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import History from "./componentes/History";
import MaterialSelector from "../materialSelector";


const CylindricalConduction = () => {
  const theme = useTheme();
  const [deltaT, setDeltaT] = useState("");  // Diferença de temperatura
  const [layers, setLayers] = useState([{ length: "", radius: "", k: "" }]);  // Camadas com comprimento, raio e condutividade térmica
  const [material, setMaterial] = useState("");  // Material selecionado
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState(0);
  const [history, setHistory] = useState([]);
 const [materials, setMaterials] = useState([]);

    useEffect(() => {
      fetch("https://materialsapi.onrender.com/materials")  // Substitua pela URL da API hospedada
        .then(response => response.json())
        .then(data => {
          const formattedMaterials = [{ name: "Selecione um material", value: "" }, 
            ...data.map(metal => ({
              name: metal.name,
              value: metal.thermalConductivity,
              symbol: metal.symbol
            }))
          ];
          setMaterials(formattedMaterials);
        })
        .catch(error => console.error("Erro ao carregar materiais:", error));
    }, []);

  const handleLayerChange = (index, field, value) => {
    if (/^-?\d*\.?\d*$/.test(value)) {
      setLayers((prevLayers) =>
        prevLayers.map((layer, i) =>
          i === index ? { ...layer, [field]: value } : layer
        )
      );
    }
  };


  useEffect(() => {
    if (totalResistance > 0) {
      saveToHistory(totalResistance);
    }
  }, [totalResistance]); // Executa quando totalResistance for atualizado
  

  useEffect(() => {
    // Recupera histórico salvo ao carregar o componente
    const storedHistory = JSON.parse(localStorage.getItem("condCilHistory")) || [];
    setHistory(storedHistory);
  }, []);
  const handleCalculate = () => {
    let totalRes = 0;
    let valid = true;
  
    layers.forEach((layer) => {
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
  

  
  const saveToHistory = (totalRes) => {
    const newEntry = {
      deltaT,
      totalResistance: Number(totalRes).toFixed(6),
      heatFlux: (parseFloat(deltaT) / totalRes).toFixed(2),
      layers: layers.map(layer => ({
        material: layer.material || "Desconhecido",
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
  
 

  const addLayer = () => {
    setLayers((prevLayers) => [...prevLayers, { length: "", radius1: "", radius2: "", k: "" }]);
  };
  
  const removeLayer = (index) => {
    setLayers(layers.filter((_, i) => i !== index));
  };

  const handleMaterialChange = (index, value) => {
    const selectedMaterial = materials.find(mat => mat.name === value);
    if (!selectedMaterial) return;
  
    setLayers(prev => {
      const newLayers = [...prev];
      newLayers[index] = { 
        ...newLayers[index], 
        k: selectedMaterial.value, // Agora usa a thermalConductivity corretamente
        material: value 
      };
      return newLayers;
    });
  };
  
  
  


  console.log("deltaT:", deltaT);
console.log("layers:", layers);
layers.forEach((layer, index) => {
  console.log(`Camada ${index + 1}:`, layer);
});

  
  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "50px auto",
        padding: "30px",
        borderRadius: "16px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: theme.palette.background.paper,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Transferência de Calor por Condução
      </Typography>

      <TextField
        label="Diferença de Temperatura (ΔT em K)"
        value={deltaT}
        onChange={(e) => {
          const value = e.target.value;
          if (/^-?\d*\.?\d*$/.test(value)) {
            setDeltaT(value);
          }
        }}
        fullWidth
        margin="normal"
      />

    

      {/* Exibindo a Condutividade Térmica abaixo do Select */}
      <Typography variant="body1">
        Condutividade térmica (k): <strong>{material ? `${materials[material]} W/m.K` : "Selecione um material"}</strong>
      </Typography>

      <Typography variant="h6" gutterBottom>
        Camadas
      </Typography>
      {layers.map((layer, index) => (
        <Box key={index} sx={{ marginBottom: "15px", textAlign: "center" }}>
        
          <TextField
            label="Comprimento do Cilindro (m)"
            value={layer.length}
            onChange={(e) => handleLayerChange(index, "length", e.target.value)}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Raio Interno (m)"
            value={layer.radius1}
            onChange={(e) => handleLayerChange(index, "radius1", e.target.value)}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Raio Externo (m)"
            value={layer.radius2}
            onChange={(e) => handleLayerChange(index, "radius2", e.target.value)}
            fullWidth
            margin="normal"
          />
            <MaterialSelector
  materials={materials}
  selectedMaterial={layer.material}
  onChange={(value) => handleMaterialChange(index, value)}
/>

          <Typography variant="body2">
            Condutividade térmica: <strong>{layer.k ? `${layer.k} W/m.K` : "Selecione um material"}</strong>
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
        sx={{
          marginBottom: "20px",
          color: "#7300ff",
          borderColor: "#7300ff",
          "&:hover": { backgroundColor: "#7300ff", color: "white" },
        }}
      >
        Adicionar Camada
      </Button>

      <Button
  variant="contained"
  onClick={handleCalculate} // Chamar diretamente
  disabled={
    !deltaT || 
    layers.some(layer => 
      !layer.length || !layer.radius1 || !layer.radius2 || !layer.k || 
      parseFloat(layer.radius2) <= parseFloat(layer.radius1)
    )
  }
  sx={{
    display: "block",
    margin: "10px auto",
    backgroundColor: "#007BFF",
    "&:hover": { backgroundColor: "#0056b3" },
  }}
>
  Calcular
</Button>





      <Box sx={{ marginTop: "20px", padding: "15px", borderRadius: "8px", backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h6">Resultados</Typography>
        <TextField
          label="Resistência Térmica Total (K/W)"
          value={totalResistance.toFixed(6)}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Fluxo de Calor (Q) em Watts"
          value={heatFlux}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />
      </Box>
      <History historyData={history} /> 

    </Box>
  );
};

export default CylindricalConduction;
