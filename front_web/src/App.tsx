import { useState } from 'react'
import Header from './components/Header';
import Footer from './components/Footer';
// import Footer from './components/Footer';
import './App.css'
import { Box, Container } from '@mui/material';

function App() {
  return (
    <Box component="main" sx={{ flex: 1, py: 4}}>
      <Header />
      
      <Box component="main" sx={{ flex: 1, py: 4 }}>
        
          <h1>Bienvenue sur MB Food</h1>
          <p>Votre application de commande de repas en ligne</p>
        
      </Box>
      
      <Footer />
    </Box>
  );
}

export default App
