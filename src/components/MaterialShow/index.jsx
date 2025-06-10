import React, { useState } from 'react';
import {
  Box,
  Typography,
  CardContent,
  CardMedia,
  Divider,
  Grid,
} from '@mui/material';

import ChartTitleWithPopover from '../TutorialLabel'; // certifique-se do caminho correto

const MaterialShow = ({ material }) => {
  const [loaded, setLoaded] = useState(false);

  if (!material) {
    return <Typography variant="h6">Nenhum material disponível.</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="flex-start">
        {/* Imagem à esquerda */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              paddingTop: '100%',
              overflow: 'hidden',
              borderRadius: 2,
            }}
          >
            {/* Thumbnail borrado */}
            <CardMedia
              component="img"
              image={material.thumbnail}
              alt="thumbnail"
              loading="lazy"
              onLoad={() => setLoaded(false)}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'blur(10px)',
                opacity: loaded ? 0 : 1,
                transition: 'opacity 0.3s',
              }}
            />
            {/* Imagem principal */}
            <CardMedia
              component="img"
              image={material.image}
              alt={material.name}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: loaded ? 1 : 0,
                transition: 'opacity 0.3s',
              }}
            />
          </Box>
        </Grid>

        {/* Texto à direita */}
        <Grid item xs={12} md={8}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h5" gutterBottom sx={{ mr: 1 }}>
                {material.name}
              </Typography>
              <ChartTitleWithPopover
                description={`Aqui voce pode consultar todos os dados que temos do material: ${material.name}. Para visualisar outro material, basta selecionalo na lista abaixo.`}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1">
              <strong>Tipo:</strong> {material.type}
            </Typography>
            <Typography variant="body1">
              <strong>Densidade:</strong> {material.density} kg/m³
            </Typography>
            <Typography variant="body1">
              <strong>Condutividade térmica (seco):</strong>{' '}
              {material.thermalConductivityDry} W/m·K
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Condutividade térmica (molhado):</strong>{' '}
              {material.thermalConductivityWet !== null
                ? `${material.thermalConductivityWet} W/m·K`
                : 'N/A'}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary" paragraph>
              {material.description}
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MaterialShow;
