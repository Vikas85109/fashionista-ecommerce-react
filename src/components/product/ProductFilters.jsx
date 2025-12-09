import { useShop } from '../../context/ShopContext';
import { categories } from '../../data/products';

const ProductFilters = () => {
  const { filters, dispatch } = useShop();

  const handleCategoryChange = (category) => {
    dispatch({ type: 'SET_FILTERS', payload: { category } });
  };

  const handleSortChange = (e) => {
    dispatch({ type: 'SET_FILTERS', payload: { sortBy: e.target.value } });
  };

  const handlePriceChange = (e, index) => {
    const newRange = [...filters.priceRange];
    newRange[index] = Number(e.target.value);
    dispatch({ type: 'SET_FILTERS', payload: { priceRange: newRange } });
  };

  return (
    <aside className="product-filters">
      <div className="filter-section">
        <h3>Categories</h3>
        <div className="category-list">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${filters.category === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>Price Range</h3>
        <div className="price-inputs">
          <input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) => handlePriceChange(e, 0)}
            placeholder="Min"
          />
          <span>-</span>
          <input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange(e, 1)}
            placeholder="Max"
          />
        </div>
      </div>

      <div className="filter-section">
        <h3>Sort By</h3>
        <select value={filters.sortBy} onChange={handleSortChange}>
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
    </aside>
  );
};

export default ProductFilters;
