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
    localStorage.removeItem("heatTransferHistory");
    setHistory([]);
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "20px auto",
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
            sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
          >
            <ListItemText
              primary={`ΔT: ${entry.deltaT}K | Resistência: ${Number(entry.totalResistance).toFixed(6)} K/W | Fluxo: ${entry.heatFlux} W`}
              primaryTypographyProps={{ color: "text.primary", variant: "body1" }}
              secondary={
                <>
                  <Typography variant="body2" color="text.secondary">
                    📅 Data: {entry.timestamp}
                  </Typography>
                  {entry.layers.map((layer, i) => (
                    <Typography key={i} variant="body2" color="text.secondary">
                      🔹 <strong>Material:</strong> {layer.material} | 🔘{" "}
                      <strong>Raio Interno:</strong> {layer.r1} m | ⚪{" "}
                      <strong>Raio Externo:</strong> {layer.r2} m
                    </Typography>
                  ))}
                </>
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
