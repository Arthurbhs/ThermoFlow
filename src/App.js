import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Hero";
import About from "./pages/Histori";
import Calculadora from "./pages/Calculadora";
import Materials from "./pages/Materials"
import ThemeProviderComponent from "./context/ThemeContext"; // Importe o ThemeProvider


const App = () => {
  return (
    
    <ThemeProviderComponent> {/* Envolva a aplicação com o provedor de tema */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Calculadora" element={<Calculadora />} />
          <Route path="/Historia" element={<About />} />
          <Route path="/Materiais" element={<Materials />} />
        </Routes>
      </Router>
    </ThemeProviderComponent>
  );
};

export default App;
