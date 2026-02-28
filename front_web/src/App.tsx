import { useState } from 'react'
import Header from './components/Header';
import Footer from './components/Footer';
// import Footer from './components/Footer';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <header>
      <Header />
    </header>

    <main>
      <h1>Bienvenue sur MB Food</h1>
      <p>Votre application de commande de repas en ligne</p>
    </main>
  
    <footer>
      <Footer />
    </footer>
    </>
  )
}

export default App
