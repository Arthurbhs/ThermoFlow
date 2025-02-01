import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, IconButton, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const materials = [
  { name: "Selecione um material", value: "" },
  { name: "Cobre", value: 385 },
  { name: "Alumínio", value: 205 },
  { name: "Ferro", value: 80 },
  { name: "Aço Inoxidável", value: 15 },
  { name: "Madeira", value: 0.15 },
  { name: "Isopor", value: 0.035 },
  { name: "Lã de Vidro", value: 0.04 },
  { name: "Concreto", value: 1.4 },
];

const HeatTransferCalculator = () => {
  const [layers, setLayers] = useState([{ k: "", l: "", a: 1, material: "" }]);
  const [deltaT, setDeltaT] = useState("");
  const [area, setArea] = useState(1);

  useEffect(() => {
    setLayers((prevLayers) => prevLayers.map((layer) => ({ ...layer, a: area })));
  }, [area]);

  const handleLayerChange = (index, field, value) => {
    const updatedLayers = [...layers];
    updatedLayers[index][field] = value;
    setLayers(updatedLayers);
  };

  const handleMaterialChange = (index, value) => {
    const selectedMaterial = materials.find((mat) => mat.name === value);
    if (selectedMaterial) {
      handleLayerChange(index, "k", selectedMaterial.value);
      handleLayerChange(index, "material", value);
    }
  };

  const addLayer = () => {
    setLayers([...layers, { k: "", l: "", a: area, material: "" }]);
  };

  const removeLayer = (index) => {
    setLayers(layers.filter((_, i) => i !== index));
  };

  const calculateResults = () => {
    let totalResistance = 0;

    layers.forEach((layer) => {
      const k = parseFloat(layer.k);
      const l = parseFloat(layer.l);
      const a = parseFloat(layer.a);

      if (k > 0 && l > 0 && a > 0) {
        totalResistance += l / (k * a);
      }
    });

    if (totalResistance === 0 || isNaN(totalResistance)) {
      return { u: "0.00", q: "0.00" };
    }

    const u = 1 / totalResistance;
    const q = u * area * parseFloat(deltaT || 0);
    return { u: u.toFixed(2), q: q.toFixed(2) };
  };

  const results = calculateResults();

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "50px auto",
        padding: "30px",
        borderRadius: "16px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Calculadora de Transferência de Calor
      </Typography>

      {/* Entrada de temperatura e área */}
      <Box sx={{ marginBottom: "20px" }}>
        <TextField
          label="Diferença de Temperatura (ΔT em K)"
          type="number"
          value={deltaT}
          onChange={(e) => setDeltaT(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Área (m²)"
          type="number"
          value={area}
          onChange={(e) => setArea(parseFloat(e.target.value) || 1)}
          fullWidth
          margin="normal"
        />
      </Box>

      {/* Entrada de camadas */}
      <Typography variant="h6" gutterBottom>
        Camadas
      </Typography>
      {layers.map((layer, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {/* Seletor de material */}
          <FormControl fullWidth>
            <InputLabel>Material</InputLabel>
            <Select
              value={layer.material}
              onChange={(e) => handleMaterialChange(index, e.target.value)}
            >
              {materials.map((mat, i) => (
                <MenuItem key={i} value={mat.name}>
                  {mat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Campo para condutividade térmica */}
          <TextField
            label="K (Condutividade térmica em W/m.K)"
            type="number"
            value={layer.k}
            onChange={(e) => handleLayerChange(index, "k", e.target.value)}
            fullWidth
            InputLabelProps={{ style: { fontSize: "13px" } }}
          />

          <TextField
            label="L (Espessura em m)"
            type="number"
            value={layer.l}
            onChange={(e) => handleLayerChange(index, "l", e.target.value)}
            fullWidth
            InputLabelProps={{ style: { fontSize: "13px" } }}
          />
          
          <IconButton onClick={() => removeLayer(index)} sx={{ color: "#9b00d9" }}>
            <RemoveCircleIcon />
          </IconButton>
        </Box>
      ))}

      {/* Botão para adicionar camada */}
      <Button
        variant="outlined"
        onClick={addLayer}
        startIcon={<AddCircleIcon />}
        sx={{
          marginBottom: "20px",
          color: "#7300ff",
          borderColor: "#7300ff",
          "&:hover": {
            backgroundColor: "#7300ff",
            color: "white",
          },
        }}
      >
        Adicionar Camada
      </Button>

      {/* Resultados */}
      <Box>
        <Typography variant="h6">Resultados</Typography>
        <Typography>Coeficiente de Transferência de Calor (U): {results.u} W/m².K</Typography>
        <Typography>Taxa de Transferência de Calor (Q): {results.q} W</Typography>
      </Box>
    </Box>
  );
};

export default HeatTransferCalculator;
