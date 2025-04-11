import React, {useState} from "react";
import { TextField, InputAdornment, IconButton, Popover, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";


const ExternalCoefficientInput = ({ value, onChange }) => {
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
           <TextField label="Coeficiente de Convecção Interno (W/m².K)"
            value={value}
           onChange={onChange}
            fullWidth
             margin="normal"
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
             Mede a troca de calor na superfície interna com o fluido interno. Varia com o tipo de fluido e fluxo. (W/m²·K)  </Typography>
           </Popover>
         </>
       );
     };


export default ExternalCoefficientInput;
