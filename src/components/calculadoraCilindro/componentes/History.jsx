import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, Button } from "@mui/material";

const History = ({ historyData }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(historyData || []);
  }, [historyData]);


  

  const clearHistory = () => {
    localStorage.removeItem("heatTransferHistory");
    setHistory([]);
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "20px auto", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: "#fff" }}>
      <Typography variant="h5" gutterBottom>
        Histórico de Cálculos
      </Typography>
      <List>
  {history.map((entry, index) => (
    <ListItem key={index} sx={{ borderBottom: "1px solid #ddd" }}>
      <ListItemText
        primary={`ΔT: ${entry.deltaT}K | Resistência: ${entry.totalResistance} K/W | Fluxo: ${entry.heatFlux} W`}
        secondary={
          <>
            <Typography variant="body2">📅 Data: {entry.timestamp}</Typography>
            {entry.layers.map((layer, i) => (
              <Typography key={i} variant="body2">
                🔹 <strong>Material:</strong> {layer.material} | 
                📏 <strong>Comprimento:</strong> {layer.length} m | 
                🔘 <strong>Raio Interno:</strong> {layer.radius1} m | 
                ⚪ <strong>Raio Externo:</strong> {layer.radius2} m
              </Typography>
            ))}
          </>
        }
      />
    </ListItem>
  ))}
</List>


      <Button variant="contained" color="error" onClick={clearHistory} sx={{ marginTop: "10px" }}>
        Limpar Histórico
      </Button>
    </Box>
  );
};

export default History;
