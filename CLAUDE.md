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

### Project Structure

```
src/
├── components/
│   ├── common/       # Navbar, Footer, Toast, ConfirmModal, ScrollToTop
│   ├── product/      # ProductCard, ProductFilters
│   └── cart/         # CartItem
├── pages/            # Route-level components
├── context/          # ShopContext (global state)
├── data/             # products.js (static product catalog)
└── assets/           # Images
```

### Application Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         main.jsx                                 │
│                    (Entry Point)                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         App.jsx                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    ShopProvider                          │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │                ToastProvider                     │    │   │
│  │  │  ┌─────────────────────────────────────────┐    │    │   │
│  │  │  │              BrowserRouter               │    │    │   │
│  │  │  │  ┌─────────────────────────────────┐    │    │    │   │
│  │  │  │  │   Navbar                        │    │    │    │   │
│  │  │  │  │   Routes (Pages)                │    │    │    │   │
│  │  │  │  │   Footer                        │    │    │    │   │
│  │  │  │  │   ScrollToTop                   │    │    │    │   │
│  │  │  │  └─────────────────────────────────┘    │    │    │   │
│  │  │  └─────────────────────────────────────────┘    │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
┌──────────────┐    dispatch(action)    ┌──────────────┐
│  Component   │ ────────────────────▶  │   Reducer    │
│  (UI Layer)  │                        │ (shopReducer)│
└──────────────┘                        └──────────────┘
       ▲                                       │
       │                                       │
       │         ┌──────────────┐              │
       │         │    State     │              │
       └──────── │   (Context)  │ ◀────────────┘
    useShop()    └──────────────┘
                        │
                        ▼ useEffect
                 ┌──────────────┐
                 │ localStorage │
                 └──────────────┘
```

### State Management (src/context/ShopContext.jsx)

Central state using Context API + useReducer pattern:

```javascript
// Access state and dispatch anywhere:
const { products, cart, wishlist, user, orders, filters, dispatch, getCartTotal, getCartCount, getFilteredProducts, isInWishlist } = useShop();

// All available actions:
dispatch({ type: 'ADD_TO_CART', payload: { ...product, size, color, quantity } })
dispatch({ type: 'REMOVE_FROM_CART', payload: cartId })
dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { cartId, quantity } })
dispatch({ type: 'CLEAR_CART' })
dispatch({ type: 'TOGGLE_WISHLIST', payload: product }) // pass full product object
dispatch({ type: 'SET_FILTERS', payload: { category, priceRange, sortBy, searchQuery } })
dispatch({ type: 'LOGIN', payload: user })
dispatch({ type: 'LOGOUT' })
dispatch({ type: 'ADD_ORDER', payload: order }) // also clears cart
dispatch({ type: 'ADD_REVIEW', payload: { productId, rating } })
```

State persists to localStorage automatically for: cart, wishlist, user, orders.

### Toast Notifications (src/components/common/ToastContainer.jsx)

```javascript
const { showSuccess, showError, showWarning, showInfo } = useToast();
showSuccess('Item added to cart');
showError('Something went wrong');
```

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

## Code Flow by Feature

### 1. Product Search Flow

```
Navbar.jsx (Search Input)
    │
    ├── onChange: setSearchQuery() + setShowResults()
    │   └── Shows dropdown with filtered products (max 5)
    │
    ├── Click Result: handleResultClick()
    │   └── navigate(`/product/${id}`)
    │
    └── Submit/View All: handleSearch()
        └── dispatch SET_FILTERS → navigate('/products')
                                        │
                                        ▼
                              Products.jsx
                              └── getFilteredProducts() renders results
```

### 2. Add to Cart Flow

```
ProductDetail.jsx
    │
    ├── User selects size & color
    │
    └── handleAddToCart()
        │
        ├── Creates cartItem with cartId = `${id}-${size}-${color}`
        │
        └── dispatch({ type: 'ADD_TO_CART', payload: cartItem })
                │
                ▼
        ShopContext.jsx (reducer)
            │
            ├── If item exists (same id+size+color): increment quantity
            └── Else: add new item to cart array
                    │
                    ▼
            useEffect saves cart to localStorage
```

### 3. Checkout Flow

```
Cart.jsx
    │
    └── "Proceed to Checkout" button
            │
            ▼
Checkout.jsx (3 Steps)
    │
    ├── Step 1: Shipping Info
    │   └── Form validation → Next
    │
    ├── Step 2: Payment Info
    │   └── Form validation → Next
    │
    └── Step 3: Review & Place Order
        │
        └── handlePlaceOrder()
            │
            ├── dispatch({ type: 'ADD_ORDER', payload: order })
            │   └── Clears cart automatically
            │
            └── navigate('/orders?success=true')
```

### 4. Wishlist Flow

```
ProductCard.jsx / ProductDetail.jsx
    │
    └── Click heart icon
            │
            └── dispatch({ type: 'TOGGLE_WISHLIST', payload: product })
                    │
                    ▼
            ShopContext.jsx (reducer)
                │
                ├── If product in wishlist: remove it
                └── Else: add to wishlist
```

### 5. Filter Products Flow

```
ProductFilters.jsx
    │
    ├── Category buttons
    ├── Price range inputs
    └── Sort dropdown
        │
        └── dispatch({ type: 'SET_FILTERS', payload: { ... } })
                │
                ▼
        Products.jsx
            │
            └── getFilteredProducts()
                │
                ├── Filter by category
                ├── Filter by searchQuery
                ├── Filter by priceRange
                └── Sort by sortBy option
```

## Component Communication

```
┌─────────────────────────────────────────────────────────────┐
│                      ShopContext                             │
│  (products, cart, wishlist, user, orders, filters)          │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
    useShop()            useShop()            useShop()
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Navbar    │      │  Products   │      │    Cart     │
│ - cart count│      │ - filtering │      │ - cart items│
│ - wishlist  │      │ - products  │      │ - totals    │
│ - search    │      │             │      │             │
└─────────────┘      └─────────────┘      └─────────────┘
```

## Product Data Structure (src/data/products.js)

```javascript
{
  id, name, price, originalPrice, image,
  category: 'men' | 'women' | 'shoes' | 'accessories',
  subcategory: 't-shirts' | 'jeans' | 'dresses' | etc,
  sizes: ['S', 'M', 'L', 'XL'],  // varies by product type
  colors: ['White', 'Black'],
  rating, reviews, description, inStock, featured
}
```

Cart items include additional fields: `cartId` (unique identifier), `size`, `color`, `quantity`.

## Styling

CSS variables defined in `src/App.css`:
- `--primary: #2563eb` (main blue)
- `--secondary: #f97316` (accent orange)
- `--success: #10b981` (success green)
- `--danger: #ef4444` (error red)
- `--dark: #1f2937` (text)
- `--light: #f9fafb` (background)
- `--radius: 8px`, `--transition: all 0.3s ease`

Mobile-first responsive design with breakpoints at 480px, 768px and 1024px.

## Key Patterns

- Cart items track variants (size, color) and merge duplicates by `cartId`
- Filters dispatch to context and components use `getFilteredProducts()`
- ProductDetail requires size/color selection before add-to-cart
- Checkout is a 3-step form with validation
- Global search shows live dropdown results, minimum 2 characters
- Toast notifications for user feedback on actions
