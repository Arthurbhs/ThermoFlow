import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Hero";
import About from "./pages/Histori";
import AboutTwo from "./pages/Histori/PageTwo" 
import AboutThree from "./pages/Histori/PageThree" 
import Calculadora from "./pages/Calculadora";
import Materials from "./pages/Materials"
import ThemeProviderComponent from "./context/ThemeContext"; // Importe o ThemeProvider
import Login from "./pages/Login"
import Register from "./pages/Register"


const App = () => {
  return (
    
    <ThemeProviderComponent> {/* Envolva a aplicação com o provedor de tema */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Calculadora" element={<Calculadora />} />
            <Route path="/Calculadora/conducao" element={<Calculadora />} />
            <Route path="/Calculadora/conveccao" element={<Calculadora />} />
          <Route path="/estudos_pag1" element={<About />} />
           <Route path="/estudos_pag2" element={<AboutTwo />} />
          <Route path="/estudos_pag3" element={<AboutThree />} />
          <Route path="/Materiais" element={<Materials />} />
           <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register/>} />

        </Routes>
      </Router>
    </ThemeProviderComponent>
  );
};

export default App;
