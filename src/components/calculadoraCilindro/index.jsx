import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  useTheme,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const CylindricalConduction = () => {
  const theme = useTheme();
  const [deltaT, setDeltaT] = useState("");  // Diferença de temperatura
  const [layers, setLayers] = useState([{ length: "", radius: "", k: "" }]);  // Camadas com comprimento, raio e condutividade térmica
  const [material, setMaterial] = useState("");  // Material selecionado
  const [totalResistance, setTotalResistance] = useState(0);
  const [heatFlux, setHeatFlux] = useState(0);

  const materials = {
    "Alumínio": 205,  // Condutividade térmica em W/m·K
    "Cobre": 385,
    "Aço": 50,
    "Madeira": 0.14,
    "Vidro": 1.05,
    "Água": 0.606,
  };

  const handleLayerChange = (index, field, value) => {
    if (/^-?\d*\.?\d*$/.test(value)) {
      setLayers((prevLayers) =>
        prevLayers.map((layer, i) =>
          i === index ? { ...layer, [field]: value } : layer
        )
      );
    }
  };

  const addLayer = () => {
    setLayers([...layers, { length: "", radius: "", k: "" }]);
  };

  const removeLayer = (index) => {
    setLayers(layers.filter((_, i) => i !== index));
  };

  const handleMaterialChange = (event) => {
    setMaterial(event.target.value);
    // Atualiza o valor de k com base no material selecionado
    setLayers(layers.map((layer) => ({ ...layer, k: materials[event.target.value] || "" })));
  };

  const handleCalculate = () => {
    let totalRes = 0;
    layers.forEach((layer) => {
      const L = parseFloat(layer.length);  // Comprimento
      const r = parseFloat(layer.radius);  // Raio
      const kValue = parseFloat(layer.k);  // Condutividade térmica

      if (!isNaN(L) && !isNaN(r) && !isNaN(kValue) && L > 0 && r > 0 && kValue > 0) {
        const area = Math.PI * Math.pow(r, 2);  // Área da seção transversal
        totalRes += L / (kValue * area);  // Resistência térmica de cada camada
      }
    });

    setTotalResistance(totalRes);
    if (totalRes > 0) {
      setHeatFlux((parseFloat(deltaT || 0) / totalRes).toFixed(2));  // Fluxo de calor
    } else {
      setHeatFlux("0.00");
    }
  };

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

      <FormControl fullWidth margin="normal">
        <InputLabel>Material</InputLabel>
        <Select
          value={material}
          onChange={handleMaterialChange}
          label="Material"
        >
          {Object.keys(materials).map((materialName) => (
            <MenuItem key={materialName} value={materialName}>
              {materialName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
            label="Raio Externo (m)"
            value={layer.radius}
            onChange={(e) => handleLayerChange(index, "radius", e.target.value)}
            fullWidth
            margin="normal"
          />

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
        onClick={handleCalculate}
        disabled={!deltaT || layers.some(layer => !layer.length || !layer.radius)}
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
    </Box>
  );
};

export default CylindricalConduction;
