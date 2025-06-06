import React, { useState } from "react";
import { Box, Typography, IconButton, Popover } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

function ChartTitleWithPopover({  description }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        size="small"
        sx={{ ml: 1 }}
      >
        <HelpOutlineIcon fontSize="small" />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2, maxWidth: 250 }}>
          <Typography variant="body2">{description}</Typography>
        </Box>
      </Popover>
    </Box>
  );
}

export default ChartTitleWithPopover;
