import React from 'react';
import { Button, Box, Typography } from '@mui/material';

const MaterialsButton = ({ material, onSelect, isSelected }) => (
  <Button
    onClick={() => onSelect(material)}
    variant="text"
    sx={{
      position: 'relative',
      padding: 0,
      minWidth: 0,
      border: isSelected ? '2px solid' : 'none',
      borderColor: isSelected ? 'primary.main' : 'transparent',
      overflow: 'hidden',
      borderRadius: 2,
      height: 100,
      width: '100%',
      transition: 'transform 0.2s',
      transform: isSelected ? 'scale(1.05)' : 'none',
      '&:hover .overlay': {
        opacity: 1,
      },
    }}
  >
    {/* Imagem de fundo */}
    <Box
      component="img"
      src={material?.thumbnail}
      alt={material?.name}
      sx={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
    />

    {/* Camada escura com nome */}
    <Box
      className="overlay"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bgcolor: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
        transition: 'opacity 0.3s',
        fontWeight: 'bold',
        textAlign: 'center',
        px: 1,
      }}
    >
      <Typography variant="caption">{material?.name}</Typography>
    </Box>
  </Button>
);

export default MaterialsButton;
