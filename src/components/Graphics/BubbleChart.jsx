import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const BubbleChart = ({ selectedMaterials }) => {
  const data = selectedMaterials.map((layer, index) => {
    const r1 = parseFloat(layer.r1) || 0;
    const r2 = parseFloat(layer.r2) || 0;
    const thickness = Math.max(r2 * 10, 5); // ou outro fator proporcional

    return {
      material: `Camada ${index + 1}: ${layer.material}`,
      k: parseFloat(layer.k) || 0, // Condutividade térmica no eixo X
      r2, // Raio externo no eixo Y
      x: index + 1,
      y: 0.5, 
      size: Math.pow(r2, 2) * 100, // destaque maior
      // Tamanho da bolha proporcional ao raio externo
    };
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
    <ScatterChart margin={{ top: 20, right: 30, bottom: 50, left: 30 }}>
      <CartesianGrid strokeDasharray="3 3" />
      
      <XAxis 
  type="number" 
  dataKey="x" 
  name="Camadas" 
  label={{ value: "Camadas", position: "bottom", offset: 35 }}  
  allowDecimals={false}
  tickFormatter={(value) => `Camada ${value}`}
/>

<YAxis 
  type="number" 
  dataKey="y"  
  domain={[0, 1]} // <-- Isso centraliza o y = 0.5
  tick={false} 
  axisLine={false} 
  name="" 
/>


  
      <ZAxis 
        type="number" 
        dataKey="size" // <- Corrigido aqui!
        range={[100, 2500]} 
        name="Raio Externo (proporcional)" 
      />
  
  <Tooltip 
  formatter={(value, name, props) => {
    if (name === 'size') {
      return [`${Math.sqrt(value / 100).toFixed(2)} m`, 'Raio Externo'];
    }
    return value;
  }}
  labelFormatter={(label, payload) => {
    if (payload[0]) return payload[0].payload.material;
    return label;
  }}
/>

      <Legend 
        layout="vertical" 
        verticalAlign="top" 
        align="right" 
        wrapperStyle={{ top: 0, left: '90%' }} 
      />
      
      <Scatter 
        name="Materiais" 
        data={data} 
        fill="#8884d8" 
      />
    </ScatterChart>
  </ResponsiveContainer>
  
  
  );
};

export default BubbleChart;
