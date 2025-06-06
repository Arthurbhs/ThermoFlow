import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { Box, Typography, Button, ButtonGroup } from "@mui/material";
import ChartTitleWithPopover from "../TutorialLabel"; // ajuste o caminho se necessário

const RadiusComparisonCharts = ({ selectedMaterials }) => {
  const [view, setView] = useState("r1"); // "r1" ou "r2"

  const colorsList = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042',
    '#8dd1e1', '#d0ed57', '#a4de6c', '#d88884'
  ];

  const filtered = selectedMaterials.filter(
    (layer) =>
      layer.material &&
      !isNaN(parseFloat(layer.r1)) &&
      !isNaN(parseFloat(layer.r2))
  );

  const data = filtered.map((layer, index) => ({
    name: `Camada ${index + 1}: ${layer.material}`,
    r1: parseFloat(layer.r1),
    r2: parseFloat(layer.r2),
    color: colorsList[index % colorsList.length],
  }));

  const fontSize = data.length > 5 ? 10 : 12;

  const currentKey = view;
  const label = view === "r1" ? "Raio Interno (m)" : "Raio Externo (m)";
  const description =
    view === "r1"
      ? "Este gráfico mostra o valor do raio interno (r₁) de cada camada."
      : "Este gráfico mostra o valor do raio externo (r₂) de cada camada.";

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
        <Typography variant="h6" sx={{ mr: 1 }}>
          {label}
        </Typography>
        <ChartTitleWithPopover description={description} />
      </Box>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis
            dataKey="name"
            angle={-10}
            textAnchor="end"
            interval={0}
            tick={{ fontSize }}
          />
          <YAxis
            label={{
              value: label,
              angle: -90,
              position: 'insideLeft',
              dy: 80,
            }}
          />
          <Tooltip
            formatter={(value) => `${value.toFixed(3)} m`}
            labelStyle={{ fontSize: 12 }}
          />
          <Bar dataKey={currentKey} radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
        <ButtonGroup variant="outlined" size="small">
          <Button
            onClick={() => setView("r1")}
            variant={view === "r1" ? "contained" : "outlined"}
          >
            Raio Interno
          </Button>
          <Button
            onClick={() => setView("r2")}
            variant={view === "r2" ? "contained" : "outlined"}
          >
            Raio Externo
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};

export default RadiusComparisonCharts;
