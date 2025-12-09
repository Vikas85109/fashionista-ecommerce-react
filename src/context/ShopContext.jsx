import { createContext, useContext, useReducer, useEffect } from 'react';
import { products } from '../data/products';

const ShopContext = createContext();

const initialState = {
  products: products,
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],
  user: JSON.parse(localStorage.getItem('user')) || null,
  orders: JSON.parse(localStorage.getItem('orders')) || [],
  filters: {
    category: 'all',
    priceRange: [0, 500],
    sortBy: 'featured',
    searchQuery: ''
  }
};

function shopReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(
        item => item.id === action.payload.id &&
                item.size === action.payload.size &&
                item.color === action.payload.color
      );

      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id &&
            item.size === action.payload.size &&
            item.color === action.payload.color
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: action.payload.quantity || 1 }]
      };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.cartId !== action.payload)
      };

    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.cartId === action.payload.cartId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    case 'TOGGLE_WISHLIST': {
      const exists = state.wishlist.find(item => item.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          wishlist: state.wishlist.filter(item => item.id !== action.payload.id)
        };
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload]
      };
    }

    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };

    case 'LOGIN':
      return { ...state, user: action.payload };

    case 'LOGOUT':
      return { ...state, user: null };

    case 'ADD_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload],
        cart: []
      };

    case 'ADD_REVIEW': {
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.productId
            ? {
                ...product,
                reviews: product.reviews + 1,
                rating: ((product.rating * product.reviews) + action.payload.rating) / (product.reviews + 1)
              }
            : product
        )
      };
    }

    default:
      return state;
  }
}

export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(shopReducer, initialState);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(state.user));
  }, [state.user]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(state.orders));
  }, [state.orders]);

  const getFilteredProducts = () => {
    let filtered = [...state.products];

    if (state.filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === state.filters.category);
    }

    if (state.filters.searchQuery) {
      const query = state.filters.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    filtered = filtered.filter(p =>
      p.price >= state.filters.priceRange[0] &&
      p.price <= state.filters.priceRange[1]
    );

    switch (state.filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => b.featured - a.featured);
    }

    return filtered;
  };

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  };

  const isInWishlist = (productId) => {
    return state.wishlist.some(item => item.id === productId);
  };

  const value = {
    ...state,
    dispatch,
    getFilteredProducts,
    getCartTotal,
    getCartCount,
    isInWishlist
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
