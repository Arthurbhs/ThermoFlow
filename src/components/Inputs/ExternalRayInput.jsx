import React, {useState} from "react";
import { TextField, InputAdornment, IconButton, Popover, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const ExternalRayInput = ({ value, onChange, error, helperText }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <TextField
        label="Raio Externo da Camada (r2)"
        value={value}
        onChange={onChange}
        fullWidth
        margin="normal"
        error={error}
        helperText={helperText}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleOpen} edge="end" size="small">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        disableRestoreFocus
      >
        <Typography sx={{ p: 2, maxWidth: 300, fontSize: 14 }}>
          Área que corresponde à medida total interna de um objeto circular.
        </Typography>
      </Popover>
    </>
  );
};


export default ExternalRayInput;
