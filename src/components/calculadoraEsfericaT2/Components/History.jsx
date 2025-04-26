import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  useTheme,
} from "@mui/material";

const History = ({ historyData }) => {
  const [history, setHistory] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    setHistory(historyData || []);
  }, [historyData]);

  const clearHistory = () => {
    localStorage.removeItem("condEsfHistory");
    setHistory([]);
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "5px auto",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: 3,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Histórico de Cálculos
      </Typography>
      <List>
        {history.map((entry, index) => (
          <ListItem
            key={index}
            sx={{
              textAlign: "left",
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ textAlign: "left" }}>
                  🔥 ΔT: {entry.deltaT}K | Resistência:{" "}
                  {Number(entry.totalResistance).toFixed(6)} K/W | Fluxo:{" "}
                  {entry.heatFlux} W
                </Typography>
              }
              secondary={
           
                  <Box sx={{ textAlign: "left", color: theme.palette.text.secondary }}>
                    📅 Data: {entry.timestamp}
                    <br />
                    ♨️ <strong>h interno:</strong> {entry.hInt || "N/A"} W/m²K |{" "}
                    <strong>h externo:</strong> {entry.hExt || "N/A"} W/m²K
                    <br />
                    <strong>Camadas:</strong>
                    <ul style={{ paddingLeft: "16px", margin: 0 }}>
                      {entry.layers.map((layer, i) => (
                       <li key={i} style={{ fontSize: "14px" }}>
                       🏗️ <strong>Material:</strong> {layer.material || "N/A"} (
                       {layer.state || "N/A"}) | <strong>r₁:</strong> {layer.r1 || "N/A"} m |{" "}
                       <strong>r₂:</strong> {layer.r2 || "N/A"} m
                     </li>
                     
                      ))}
                    </ul>
                  </Box>
                
                
              }
            />
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        color="error"
        onClick={clearHistory}
        sx={{ marginTop: "10px" }}
      >
        Limpar Histórico
      </Button>
    </Box>
  );
};

export default History;
