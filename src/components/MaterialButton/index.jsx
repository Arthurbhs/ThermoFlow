// src/components/MaterialButton.jsx
import React from 'react';
import { Button, Avatar } from '@mui/material';

const MaterialsButton = ({ material, onSelect, isSelected }) => (
  <Button
    onClick={() => onSelect(material)}
    variant={isSelected ? 'outlined' : 'text'}
    sx={{
      borderColor: isSelected ? 'primary.main' : 'transparent',
      transform: isSelected ? 'scale(1.05)' : 'none',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      padding: 1,
    }}
  >
    <Avatar
      src={material?.thumbnail}
      alt={material?.name}
      variant="rounded"
      sx={{ width: 64, height: 64 }}
    />
  </Button>
);

export default MaterialsButton;
