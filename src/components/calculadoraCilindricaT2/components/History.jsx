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
    <Box sx={{ maxWidth: 500, margin: "5px auto", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: "#fff" }}>
      <Typography variant="h5" gutterBottom>
        Histórico de Cálculos
      </Typography>
      <List>
        {history.map((entry, index) => (
          <ListItem key={index} sx={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ textAlign: "left" }}>
                  🔥 ΔT: {entry.deltaT}K | Resistência: {Number(entry.totalResistance).toFixed(6)} K/W | Fluxo: {entry.heatFlux} W
                </Typography>
              }
              secondary={
                <Box sx={{ textAlign: "left" }}>
                  📅 Data: {entry.timestamp}
                  <br />
                  <strong>Camadas:</strong>
                  <ul style={{ paddingLeft: "16px", margin: 0 }}>
                    {entry.layers.map((layer, i) => (
                      <li key={i} style={{ fontSize: "14px" }}>
                        🏗️ <strong>L:</strong> {layer.length || "N/A"} m | <strong>r₁:</strong> {layer.rInternal || "N/A"} m | <strong>r₂:</strong> {layer.rExternal || "N/A"} m | <strong>h:</strong> {layer.h || "N/A"} W/m²K
                      </li>
                    ))}
                  </ul>
                </Box>
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
