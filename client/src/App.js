import './App.css';
import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";

function App() {

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/homepage" element={<HomePage/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;