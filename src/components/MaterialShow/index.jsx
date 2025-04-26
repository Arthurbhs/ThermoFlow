// Usa thumbnail até a imagem principal carregar
import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Divider } from '@mui/material';

const MaterialShow = ({ material }) => {
  const [loaded, setLoaded] = useState(false);

  if (!material) {
    return <Typography variant="h6">Nenhum material disponível.</Typography>;
  }

  return (
    <Card>
      <Box sx={{ position: 'relative', height: 300, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="300"
          image={material.thumbnail}
          alt="thumbnail"
            loading="lazy"
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            filter: 'blur(10px)',
            transition: 'opacity 0.3s',
            opacity: loaded ? 0 : 1,
          }}
        />
        <CardMedia
          component="img"
          height="300"
          image={material.image}
          alt={material.name}
          onLoad={() => setLoaded(true)}
            loading="lazy"
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.3s',
            opacity: loaded ? 1 : 0,
          }}
        />
      </Box>

      <CardContent>
        <Typography variant="h5" gutterBottom>{material.name}</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {material.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body1"><strong>Tipo:</strong> {material.type}</Typography>
        <Typography variant="body1"><strong>Densidade:</strong> {material.density} kg/m³</Typography>
        <Typography variant="body1">
          <strong>Condutividade térmica (seco):</strong> {material.thermalConductivityDry} W/m·K
        </Typography>
        <Typography variant="body1">
          <strong>Condutividade térmica (molhado):</strong>{' '}
          {material.thermalConductivityWet !== null ? `${material.thermalConductivityWet} W/m·K` : 'N/A'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MaterialShow;
