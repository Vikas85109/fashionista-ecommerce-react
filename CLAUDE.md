# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fashionista is a frontend-only fashion e-commerce website built with React 19. It uses localStorage for data persistence with no backend dependency.

## Development Commands

```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Production build to dist/
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Technology Stack

- **React 19.2** with Vite 7.2
- **React Router DOM 7** for client-side routing
- **React Context + useReducer** for state management
- **Framer Motion** for animations
- **react-icons** (Feather icons)
- **CSS3** with CSS variables for theming

## Architecture

### State Management (src/context/ShopContext.jsx)

Central state using Context API + useReducer pattern:

```javascript
// Access state and dispatch anywhere:
const { state, dispatch, getCartTotal, getFilteredProducts, isInWishlist } = useShop();

// Key actions:
dispatch({ type: 'ADD_TO_CART', payload: { product, size, color, quantity } })
dispatch({ type: 'TOGGLE_WISHLIST', payload: productId })
dispatch({ type: 'SET_FILTERS', payload: { category, priceRange, sortBy, searchQuery } })
```

State persists to localStorage automatically for: cart, wishlist, user, orders.

### Routing (src/App.jsx)

```
/                → Home (hero, categories, features)
/products        → Product listing with filters
/product/:id     → Product detail with variants
/cart            → Shopping cart
/wishlist        → Saved items
/checkout        → Multi-step checkout (3 steps)
/auth            → Login/Register
/orders          → Order history
```

### Project Structure

```
src/
├── components/
│   ├── common/       # Navbar, Footer
│   ├── product/      # ProductCard, ProductFilters
│   └── cart/         # CartItem
├── pages/            # Route-level components
├── context/          # ShopContext (global state)
├── data/             # products.js (static product catalog)
└── assets/           # Images
```

### Product Data Structure (src/data/products.js)

```javascript
{
  id, name, price, originalPrice, image,
  category: 'men' | 'women' | 'shoes' | 'accessories',
  sizes: ['S', 'M', 'L', 'XL'],
  colors: ['White', 'Black'],
  rating, reviews, description, inStock, featured
}
```

## Styling

CSS variables defined in `src/index.css`:
- `--primary: #6366f1` (main blue)
- `--bg-primary: #0f0f1a` (dark background)
- `--radius: 8px`, `--transition: all 0.3s ease`

Mobile-first responsive design with breakpoints at 768px and 1024px.

## Key Patterns

- Cart items track variants (size, color) and merge duplicates
- Filters dispatch to context and components use `getFilteredProducts()`
- ProductDetail requires size/color selection before add-to-cart
- Checkout is a 3-step form with validation
