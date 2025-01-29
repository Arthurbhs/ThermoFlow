import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Hero";
import About from "./pages/Histori";
import Calculadora from "./pages/Calculadora"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Calculadora" element={<Calculadora />} />
        <Route path="/Historia" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;
