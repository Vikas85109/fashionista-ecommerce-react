import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters';

const Products = () => {
  const [searchParams] = useSearchParams();
  const { getFilteredProducts, dispatch, filters } = useShop();
  const products = getFilteredProducts();

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      // When navigating via category link, set category and clear search
      dispatch({ type: 'SET_FILTERS', payload: { category, searchQuery: '' } });
    }
  }, [searchParams, dispatch]);

  return (
    <div className="products-page">
      <div className="products-container">
        <ProductFilters />

        <div className="products-main">
          <div className="products-header">
            <h1>
              {filters.category === 'all' ? 'All Products' : filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}
            </h1>
            <p>{products.length} products found</p>
          </div>

          {products.length === 0 ? (
            <div className="no-products">
              <p>No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
