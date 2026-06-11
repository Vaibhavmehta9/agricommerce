import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'agri_cart'

function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCartFromStorage)
  const [isOpen, setIsOpen] = useState(false)

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addToCart = useCallback((product, qty = 1) => {
    if (product.stock <= 0 || product.status === 'inactive') {
      toast.error(`"${product.name}" is out of stock!`)
      return false
    }

    const existing = items.find((item) => item.product._id === product._id)
    const currentQty = existing ? existing.quantity : 0
    const newQty = currentQty + qty

    if (product.stock !== undefined && newQty > product.stock) {
      toast.error(`Only ${product.stock} items available in stock.`)
      return false
    }

    setItems((prev) => {
      if (existing) {
        toast.success(`Updated quantity to ${newQty}`)
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: newQty }
            : item
        )
      } else {
        toast.success(`${product.name} added to cart`)
        return [...prev, { product, quantity: qty }]
      }
    })
    return true
  }, [items])

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((item) => item.product._id !== productId))
    toast.success('Item removed from cart')
  }, [])

  const updateQuantity = useCallback((productId, qty) => {
    if (qty < 1) return
    setItems((prev) =>
      prev.map((item) => {
        if (item.product._id === productId) {
          const maxStock = item.product.stock ?? 999
          if (qty > maxStock) {
            toast.error(`Only ${maxStock} items available in stock.`)
            return { ...item, quantity: maxStock }
          }
          return { ...item, quantity: qty }
        }
        return item
      })
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    localStorage.removeItem(CART_STORAGE_KEY)
  }, [])

  const getTotal = useCallback(() => {
    return items.reduce((total, item) => {
      const price = item.product.price || 0
      return total + price * item.quantity
    }, 0)
  }, [items])

  const getCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }, [items])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), [])

  const value = {
    items,
    isOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getCount,
    openCart,
    closeCart,
    toggleCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
