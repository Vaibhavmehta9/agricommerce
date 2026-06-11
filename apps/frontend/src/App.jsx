import React from 'react'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ModeProvider } from './context/ModeContext'
import AppRouter from './router/AppRouter'

function App() {
  return (
    <AuthProvider>
      <ModeProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </ModeProvider>
    </AuthProvider>
  )
}

export default App
