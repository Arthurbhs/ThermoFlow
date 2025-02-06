import Header from "../../components/Header";
import CalculadoraPlana from "../../components/calculadoraPlana";
import CalculadoraCilindro from "../../components/calculadoraCilindro";
import CalculadoraEsferico from "../../components/CalculadoraEsferica";
import {Box} from "@mui/material";

const CalculadoraCoe = () => {
    return (
        <Box
        sx={{
          margin: "-10px"
        }}>
<Header/><CalculadoraPlana/>
<CalculadoraCilindro/>
<CalculadoraEsferico/>
</Box>
    )
}

export default CalculadoraCoe;