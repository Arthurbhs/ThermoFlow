import React, { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell
} from 'recharts';

import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import ChartTitleWithPopover from '../TutorialLabel'; // ajuste o caminho se necessário

const ThermalConductivityChartPlane = ({ selectedMaterials }) => {
  const [selectedMetric, setSelectedMetric] = useState('Condutividade');

  const colorsList = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042',
    '#8dd1e1', '#d0ed57', '#a4de6c', '#d88884'
  ];

  const data = selectedMaterials.map((layer, index) => ({
    name: `Camada ${index + 1}: ${layer.material || layer.name || 'Sem Nome'}`,
    Condutividade: layer.thermalConductivity || 0,
    Espessura: parseFloat(layer.length) || 0,
    Área: parseFloat(layer.area) || 0,
  }));

  const fontSize = data.length > 5 ? 10 : 12;

  const metricLabels = {
    Condutividade: 'Condutividade Térmica (W/m·K)',
    Espessura: 'Espessura (m)',
    Área: 'Área (m²)',
  };

  const metricDescriptions = {
    Condutividade: 'Mede e compara a capacidade dos um materiais em conduzir calor. Quanto maior, mais facilmente o calor se propaga.',
    Espessura: 'Refere-se à distância entre as faces da camada. Camadas mais espessas tendem a oferecer maior resistência térmica.',
    Área: 'Superfícies das camadas exposta à transferência de calor. Áreas maiores permitem maior troca térmica.',
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
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis
            dataKey="name"
            angle={-10}
            textAnchor="end"
            interval={0}
            tick={{ fontSize: fontSize }}
          />
          <YAxis
            label={{
              value: metricLabels[selectedMetric],
              angle: -90,
              position: 'insideLeft',
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
          variant={selectedMetric === 'Condutividade' ? 'contained' : 'outlined'}
          onClick={() => setSelectedMetric('Condutividade')}
        >
          Cond.Térmica
        </Button>
        <Button
          variant={selectedMetric === 'Espessura' ? 'contained' : 'outlined'}
          onClick={() => setSelectedMetric('Espessura')}
        >
          Espessura
        </Button>
        <Button
          variant={selectedMetric === 'Área' ? 'contained' : 'outlined'}
          onClick={() => setSelectedMetric('Área')}
        >
          Área
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default ThermalConductivityChartPlane;
