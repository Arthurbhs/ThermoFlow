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

  console.log(historyData);

  return (
    <Box sx={{ maxWidth: 500, margin: "5px auto", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: "#fff" }}>
      <Typography variant="h5" gutterBottom>
        Histórico de Cálculos
      </Typography>
      <List>
        {history.map((entry, index) => (
          <ListItem key={index} sx={{ textAlign: "left" }}> {/* Garante alinhamento à esquerda */}
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ textAlign: "left" }}>
                  ΔT: {entry.deltaT}K | Resistência: {Number(entry.totalResistance).toFixed(6)} K/W | Fluxo: {entry.heatFlux} W
                </Typography>
              }
              secondary={
                <Box sx={{ textAlign: "left" }}> {/* Alinha a esquerda os detalhes */}
                  📅 Data: {entry.timestamp}
                  <ul style={{ paddingLeft: "16px", margin: 0 }}> {/* Mantém a indentação da lista */}
                    {entry.layers.map((layer, i) => (
                      <li key={i}>
                        🔹 <strong>Material:</strong> {layer.material || "N/A"} | <strong>h:</strong> {layer.h || "N/A"} W/m²K |  <strong>Área: </strong>{layer.a || "N/A"} m²
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
