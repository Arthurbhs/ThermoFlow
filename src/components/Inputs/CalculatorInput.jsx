import React from "react";
import { TextField} from "@mui/material";
import TutorialLabel from "../TutorialLabel"

const CalculatorInput = ({ value, onChange, label, description }) => {

  return (
    <>
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: (
            <TutorialLabel
      description={description}
    />
          ),
        }}
      />

    </>
  );
};

export default CalculatorInput;
