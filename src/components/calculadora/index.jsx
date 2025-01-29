import React, { useState } from "react";
import { Box, TextField, Button, Typography, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const HeatTransferCalculator = () => {
  const [layers, setLayers] = useState([{ k: "", l: "", a: 1 }]);
  const [deltaT, setDeltaT] = useState("");
  const [area, setArea] = useState(1);

  const handleLayerChange = (index, field, value) => {
    const updatedLayers = [...layers];
    updatedLayers[index][field] = value;
    setLayers(updatedLayers);
  };

  const addLayer = () => {
    setLayers([...layers, { k: "", l: "", a: area }]);
  };

  const removeLayer = (index) => {
    const updatedLayers = layers.filter((_, i) => i !== index);
    setLayers(updatedLayers);
  };

  const calculateResults = () => {
    let totalResistance = 0;
    layers.forEach((layer) => {
      const k = parseFloat(layer.k);
      const l = parseFloat(layer.l);
      const a = parseFloat(layer.a);
      if (k && l && a) {
        totalResistance += l / (k * a);
      }
    });

    const u = 1 / totalResistance;
    const q = u * area * parseFloat(deltaT);
    return { u: isNaN(u) ? 0 : u.toFixed(2), q: isNaN(q) ? 0 : q.toFixed(2) };
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
      <Box sx={{ marginBottom: "20px" }}>
        <TextField
          label="Diferença de Temperatura (ΔT em °C)"
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
          onChange={(e) => setArea(e.target.value)}
          fullWidth
          margin="normal"
        />
      </Box>
      <Typography variant="h6" gutterBottom>
        Camadas
      </Typography>
      {layers.map((layer, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
        <TextField
  label="K (Condutividade térmica em W/m.K)"
  type="number"
  value={layer.k}
  onChange={(e) => handleLayerChange(index, "k", e.target.value)}
  fullWidth
  InputLabelProps={{
    style: { fontSize: "13px" }, // Fonte reduzida
  }}
/>

          <TextField
            label="L (Espessura em m)"
            type="number"
            value={layer.l}
            onChange={(e) => handleLayerChange(index, "l", e.target.value)}
            fullWidth
            InputLabelProps={{
                style: { fontSize: "13px" }, // Fonte reduzida
              }}
          />
          <IconButton
  onClick={() => removeLayer(index)}
  sx={{ color: "#9b00d9" }} // Define a cor do ícone como roxo
>
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
    color: "#7300ff", // Define a cor do texto e da borda como roxo
    borderColor: "#7300ff", // Define a cor da borda como roxo
    "&:hover": {
      backgroundColor: "#7300ff", // Preenche o fundo ao passar o mouse
      color: "white", // Altera o texto para branco no hover
    },
  }}
>
  Adicionar Camada
</Button>

      <Box>
        <Typography variant="h6">Resultados</Typography>
        <Typography>Coeficiente de Transferência de Calor (U): {results.u} W/m².K</Typography>
        <Typography>Taxa de Transferência de Calor (Q): {results.q} W</Typography>
      </Box>
    </Box>
  );
};

export default HeatTransferCalculator;
