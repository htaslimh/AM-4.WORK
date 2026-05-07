/**
 * AMERTALOKA - Products Module
 * Handles loading and displaying products from JSON
 */

// Product data (will be loaded from JSON)
let productsData = null;

/**
 * Initialize products on page load
 */
document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  
  // Render products on homepage (limited)
  const homeGrid = document.getElementById('productsGrid');
  if (homeGrid) {
    renderProducts(homeGrid, 6); // Show only 6 on homepage
  }

  // Render all products on products page
  const allProductsGrid = document.getElementById('allProductsGrid');
  if (allProductsGrid) {
    renderProducts(allProductsGrid);
    initFilters();
  }
});

/**
 * Load products from JSON file
 */
async function loadProducts() {
  try {
    const response = await fetch('data/products.json');
    if (!response.ok) throw new Error('Failed to load products');
    productsData = await response.json();
    return productsData;
  } catch (error) {
    console.error('Error loading products:', error);
    // Fallback data
    productsData = {
      products: [],
      categories: []
    };
    return productsData;
  }
}

/**
 * Render products to a grid
 */
function renderProducts(container, limit = null, filter = 'all') {
  if (!productsData || !productsData.products) {
    container.innerHTML = '<p>Loading products...</p>';
    return;
  }

  let products = [...productsData.products];

  // Apply filter
  if (filter !== 'all') {
    products = products.filter(p => 
      p.category.toLowerCase().replace(/\s+/g, '-') === filter
    );
  }

  // Apply limit
  if (limit) {
    products = products.slice(0, limit);
  }

  // Generate HTML
  container.innerHTML = products.map(product => createProductCard(product)).join('');

  // Trigger animations for new cards
  if (typeof window.animations !== 'undefined') {
    container.querySelectorAll('.product-card').forEach(card => {
      window.animations.animateProductCard(card);
    });
  }
}

/**
 * Create a product card HTML
 */
function createProductCard(product) {
  const statusBadge = getStatusBadge(product);
  const priceFormatted = formatPrice(product.price);

  return `
    <article class="product-card" data-id="${product.id}" data-category="${product.category}">
      <div class="product-card__image">
        ${product.image 
          ? `<img src="${product.image}" alt="${product.name}" loading="lazy">`
          : `<div class="product-card__image-placeholder">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3c.83 0 1.5.67 1.5 1.5S12.83 8 12 8s-1.5-.67-1.5-1.5S11.17 5 12 5zm4 12H8v-1c0-2 4-3.1 4-3.1s4 1.1 4 3.1v1z" fill="currentColor"/>
              </svg>
              <span class="text-caption">Product Image</span>
            </div>`
        }
        ${statusBadge}
      </div>
      <div class="product-card__content">
        <span class="product-card__category">${product.category}</span>
        <h3 class="product-card__title">${product.name}</h3>
        <p class="product-card__description">${product.description}</p>
        <div class="product-card__footer">
          <div>
            <span class="product-card__price">${priceFormatted}</span>
            <span class="product-card__unit">/${product.unit}</span>
          </div>
          ${product.status !== 'out_of_stock' 
            ? `<a href="contact.html?product=${encodeURIComponent(product.name)}" class="product-card__cta">Pesan</a>`
            : `<span class="product-card__cta" style="background: var(--color-gray-400); cursor: not-allowed;">Habis</span>`
          }
        </div>
      </div>
    </article>
  `;
}

/**
 * Get status badge HTML
 */
function getStatusBadge(product) {
  if (product.badge === 'new') {
    return '<span class="product-card__badge product-card__badge--new">Baru</span>';
  }
  if (product.badge === 'bestseller') {
    return '<span class="product-card__badge product-card__badge--bestseller">Best Seller</span>';
  }
  if (product.status === 'out_of_stock') {
    return '<span class="product-card__badge product-card__badge--out">Habis</span>';
  }
  if (product.status === 'limited') {
    return '<span class="product-card__badge product-card__badge--new">Terbatas</span>';
  }
  return '';
}

/**
 * Format price to Indonesian Rupiah
 */
function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Initialize category filters
 */
function initFilters() {
  const filterButtons = document.querySelectorAll('[data-filter]');
  const productsGrid = document.getElementById('allProductsGrid');

  if (!filterButtons.length || !productsGrid) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter products
      const filter = button.dataset.filter;
      renderProducts(productsGrid, null, filter);
    });
  });
}

/**
 * Search products
 */
function searchProducts(query) {
  if (!productsData || !productsData.products) return [];

  const searchTerm = query.toLowerCase().trim();
  
  return productsData.products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
}

// Export for global use
window.products = {
  load: loadProducts,
  render: renderProducts,
  search: searchProducts,
  getData: () => productsData,
};
