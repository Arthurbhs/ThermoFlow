import React, { useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell
} from "recharts";

import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import ChartTitleWithPopover from "../TutorialLabel"; // ajuste o caminho se necessário

const ThermalConductivityChart = ({ selectedMaterials }) => {
  const [selectedMetric, setSelectedMetric] = useState("k");

  const colorsList = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042',
    '#8dd1e1', '#d0ed57', '#a4de6c', '#d88884'
  ];

  const data = selectedMaterials.map((layer, index) => ({
    name: `Camada ${(index + 1)}: ${layer.material || 'Sem Nome'}`,
    k: parseFloat(layer.k) || 0,
    length: parseFloat(layer.length) || 0,
  }));

  const fontSize = data.length > 5 ? 10 : 12;

  const metricLabels = {
    k: "Condutividade Térmica (W/m·K)",
    length: "Comprimento (m)",
  };

  const metricDescriptions = {
    k: "Mede e compara a capacidade dos materiais em conduzir calor. Quanto maior, mais facilmente o calor se propaga.",
    length: "Distância entre a base e o topo das camadas. Maior comprimento geralmente implica maior resistência térmica.",
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
        <Typography variant="h6" sx={{ mr: 1 }}>
          {metricLabels[selectedMetric]}
        </Typography>
        <ChartTitleWithPopover description={metricDescriptions[selectedMetric]} />
      </Box>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 55 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-10}
            textAnchor="end"
            interval={0}
            tick={{ fontSize }}
          />
          <YAxis
            label={{
              value: metricLabels[selectedMetric],
              angle: -90,
              position: "insideLeft",
              dy: 80
            }}
          />
          <Tooltip />
          <Bar
            dataKey={selectedMetric}
            name={metricLabels[selectedMetric]}
            radius={[4, 4, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colorsList[index % colorsList.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <ButtonGroup variant="outlined" size="small" sx={{ mt: 1 }}>
        <Button
          variant={selectedMetric === 'k' ? 'contained' : 'outlined'}
          onClick={() => setSelectedMetric('k')}
        >
          Condutividade
        </Button>
        <Button
          variant={selectedMetric === 'length' ? 'contained' : 'outlined'}
          onClick={() => setSelectedMetric('length')}
        >
          Comprimento
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default ThermalConductivityChart;
