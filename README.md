# Fashionista - E-Commerce React Application

A modern, fully-featured fashion e-commerce web application built with React 19. This is a frontend-only application that uses localStorage for data persistence.

## Features

- Product browsing with category filters and search
- Global search with live dropdown results
- Shopping cart with quantity management
- Wishlist functionality
- User authentication (localStorage-based)
- Multi-step checkout process
- Order history
- Responsive design for mobile and desktop
- Toast notifications
- Animated UI with Framer Motion

## Tech Stack

- **React 19.2** - UI Library
- **Vite 7.2** - Build tool and dev server
- **React Router DOM 7** - Client-side routing
- **Framer Motion** - Animations
- **react-icons** - Icon library (Feather icons)
- **CSS3** - Styling with CSS variables

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd fashionista-ecommerce-react

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
fashionista-ecommerce-react/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and media
│   ├── components/
│   │   ├── common/        # Shared components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── ToastContainer.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   └── ScrollToTop.jsx
│   │   ├── product/       # Product-related components
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProductFilters.jsx
│   │   └── cart/          # Cart components
│   │       └── CartItem.jsx
│   ├── context/
│   │   └── ShopContext.jsx  # Global state management
│   ├── data/
│   │   └── products.js      # Product catalog data
│   ├── pages/               # Route-level components
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Wishlist.jsx
│   │   ├── Checkout.jsx
│   │   ├── Auth.jsx
│   │   └── Orders.jsx
│   ├── App.jsx              # Root component with routing
│   ├── App.css              # Global styles
│   ├── main.jsx             # Entry point
│   └── index.css            # CSS variables and base styles
├── package.json
├── vite.config.js
└── README.md
```

## Application Flow

### User Journey

1. **Home Page** → Browse featured products, categories, and promotional banners
2. **Products Page** → Filter by category, price, sort options; use search
3. **Product Detail** → Select size/color, add to cart or wishlist
4. **Cart** → Review items, update quantities, proceed to checkout
5. **Checkout** → 3-step process (Shipping → Payment → Review)
6. **Orders** → View order history (requires login)

### Data Flow

```
User Action → Component → dispatch(action) → Reducer → New State → localStorage → UI Update
```

## Pages Overview

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero section, featured products, categories |
| `/products` | Products | Product grid with filters and search |
| `/product/:id` | ProductDetail | Single product view with variants |
| `/cart` | Cart | Shopping cart management |
| `/wishlist` | Wishlist | Saved items |
| `/checkout` | Checkout | 3-step checkout process |
| `/auth` | Auth | Login/Register forms |
| `/orders` | Orders | Order history |

## State Management

The app uses React Context API with useReducer for global state. See `src/context/ShopContext.jsx`.

### Global State Structure

```javascript
{
  products: [],      // Product catalog
  cart: [],          // Cart items with variants
  wishlist: [],      // Wishlisted products
  user: null,        // Logged in user
  orders: [],        // Order history
  filters: {         // Product filters
    category: 'all',
    priceRange: [0, 500],
    sortBy: 'featured',
    searchQuery: ''
  }
}
```

### Persisted Data

The following data is automatically saved to localStorage:
- Cart items
- Wishlist items
- User session
- Order history

## Styling

- CSS variables for consistent theming (`src/App.css`)
- Mobile-first responsive design
- Breakpoints: 480px, 768px, 1024px

### Color Palette

| Variable | Value | Usage |
|----------|-------|-------|
| `--primary` | #2563eb | Primary blue |
| `--secondary` | #f97316 | Accent orange |
| `--success` | #10b981 | Success states |
| `--danger` | #ef4444 | Error states |
| `--dark` | #1f2937 | Text color |
| `--light` | #f9fafb | Background |

## License

MIT
