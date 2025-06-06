import React, { useContext } from 'react';
import { TextField } from '@mui/material';
import { ThemeContext } from '../../context/ThemeContext';

const CustomTextField = ({ ...props }) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <TextField
      InputLabelProps={{
        sx: {
          color: darkMode ? '#d890d3' : '#4b0082',
          '&.Mui-focused': {
            color: darkMode ? '#d890d3' : '#4b0082',
          },
        },
      }}
      sx={{
        marginBottom: '15px',
        backgroundColor: darkMode ? '#2b2b2b' : '#e2d3eb',
        borderRadius: '8px',

        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: darkMode ? '#555' : '#cdbcd6',
          },
          '&:hover fieldset': {
            borderColor: darkMode ? '#aaa' : '#a178b2',
          },
          '&.Mui-focused fieldset': {
            borderColor: darkMode ? '#d890d3' : '#4b0082',
          },
        },

        '& input': {
          color: darkMode ? 'white' : 'black',
        },

        ...props.sx, // Permite sobrescrever estilos
      }}
      {...props}
    />
  );
};

export default CustomTextField;
