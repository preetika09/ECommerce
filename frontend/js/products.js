/* ==========================================================================
   ShopVerse - Products Catalog Page Script
   ========================================================================== */

let currentPage = 1;

document.addEventListener('DOMContentLoaded', async () => {
  await loadCategoriesDropdown();
  
  // Read URL search params
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  const searchParam = urlParams.get('search');
  const sortParam = urlParams.get('sort');

  if (categoryParam) {
    const catSelect = document.getElementById('filter-category');
    if (catSelect) catSelect.value = categoryParam;
  }
  if (searchParam) {
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) searchInput.value = searchParam;
  }
  if (sortParam) {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortSelect.value = sortParam;
  }

  fetchProducts();
});

async function loadCategoriesDropdown() {
  const catSelect = document.getElementById('filter-category');
  if (!catSelect) return;

  try {
    const res = await apiFetch('/categories');
    if (res.success) {
      catSelect.innerHTML = `<option value="">All Categories</option>` +
        res.categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    }
  } catch (err) {
    console.error('Failed to load categories:', err);
  }
}

async function fetchProducts(page = 1) {
  currentPage = page;
  const grid = document.getElementById('products-catalog-grid');
  const countText = document.getElementById('results-count-text');
  const titleText = document.getElementById('catalog-title');

  // Render skeleton state
  grid.innerHTML = Array(6).fill(0).map(() => `
    <div class="col">
      <div class="product-card">
        <div class="product-img-wrapper skeleton"></div>
        <div class="product-body">
          <div class="skeleton mb-2" style="height: 14px; width: 40%;"></div>
          <div class="skeleton mb-2" style="height: 18px; width: 85%;"></div>
          <div class="skeleton mt-auto" style="height: 24px; width: 50%;"></div>
        </div>
      </div>
    </div>
  `).join('');

  // Collect filter states
  const category = document.getElementById('filter-category').value;
  const subcategory = document.getElementById('filter-subcategory').value;
  const minPrice = document.getElementById('filter-min-price').value;
  const maxPrice = document.getElementById('filter-max-price').value;
  const inStock = document.getElementById('filter-in-stock').checked;
  const sort = document.getElementById('sort-select').value;
  const urlParams = new URLSearchParams(window.location.search);
  const search = urlParams.get('search') || document.getElementById('global-search-input').value.trim();

  // Checked rating
  const ratingRadio = document.querySelector('input[name="ratingFilter"]:checked');
  const minRating = ratingRadio ? ratingRadio.value : '';

  // Selected brands
  const brandCheckboxes = document.querySelectorAll('.brand-checkbox:checked');
  const selectedBrands = Array.from(brandCheckboxes).map(cb => cb.value).join(',');

  // Build API Query string
  const queryParams = new URLSearchParams();
  if (category) queryParams.set('category', category);
  if (subcategory) queryParams.set('subcategory', subcategory);
  if (minPrice) queryParams.set('minPrice', minPrice);
  if (maxPrice) queryParams.set('maxPrice', maxPrice);
  if (minRating) queryParams.set('minRating', minRating);
  if (inStock) queryParams.set('inStock', 'true');
  if (selectedBrands) queryParams.set('brand', selectedBrands);
  if (search) queryParams.set('search', search);
  if (sort) queryParams.set('sort', sort);
  queryParams.set('page', page);
  queryParams.set('limit', 12);

  // Update Page Title
  if (search) {
    titleText.textContent = `Search Results for "${search}"`;
  } else if (category) {
    titleText.textContent = category;
  } else {
    titleText.textContent = 'All Products';
  }

  try {
    const res = await apiFetch(`/products?${queryParams.toString()}`);
    if (res.success) {
      countText.textContent = `Showing ${res.products.length} of ${res.total} products`;

      // Render Brands in Sidebar if available
      renderBrandsList(res.availableBrands || []);

      if (res.products.length === 0) {
        grid.innerHTML = `
          <div class="col-12 text-center py-5">
            <div class="text-muted mb-3"><i class="fa-solid fa-box-open fa-3x"></i></div>
            <h5>No Products Match Your Filter Criteria</h5>
            <p class="text-muted small">Try adjusting your filters or search term</p>
            <button onclick="resetFilters()" class="btn btn-outline-primary btn-sm">Reset Filters</button>
          </div>
        `;
        document.getElementById('catalog-pagination').innerHTML = '';
        return;
      }

      grid.innerHTML = res.products.map(p => `
        <div class="col">
          <div class="product-card">
            ${p.discount > 0 ? `<span class="product-badge-discount">-${p.discount}%</span>` : ''}
            <button class="wishlist-btn-overlay" onclick="toggleWishlist('${p._id}', this)" title="Add to Wishlist">
              <i class="fa-solid fa-heart"></i>
            </button>
            
            <a href="/product-details.html?id=${p._id}" class="product-img-wrapper">
              <img src="${p.images[0] || '/images/placeholder.svg'}" alt="${p.name}" loading="lazy" onerror="handleImageError(this)">
            </a>

            <div class="product-body">
              <div class="product-brand">${p.brand}</div>
              <a href="/product-details.html?id=${p._id}" class="product-title">${p.name}</a>
              
              <div class="d-flex align-items-center gap-1 mb-2">
                <span class="rating-stars"><i class="fa-solid fa-star"></i> ${p.rating}</span>
                <span class="text-muted small">(${p.numReviews})</span>
              </div>

              <div class="product-price-box">
                <span class="current-price">₹${p.price}</span>
                ${p.originalPrice > p.price ? `<span class="original-price">₹${p.originalPrice}</span>` : ''}
              </div>

              <div class="product-actions-btn">
                <button onclick="addToCart('${p._id}')" class="btn btn-primary"><i class="fa-solid fa-cart-plus me-1"></i> Add</button>
                <button onclick="openQuickView('${p._id}')" class="btn btn-outline-secondary" title="Quick View"><i class="fa-solid fa-eye"></i></button>
              </div>
            </div>
          </div>
        </div>
      `).join('');

      renderPagination(res.page, res.pages);
    }
  } catch (err) {
    grid.innerHTML = `<div class="col-12 alert alert-danger">${err.message}</div>`;
  }
}

function renderBrandsList(brands) {
  const container = document.getElementById('brands-checkbox-list');
  if (!container) return;

  if (brands.length === 0) {
    container.innerHTML = `<span class="text-muted small">No brand filters available</span>`;
    return;
  }

  container.innerHTML = brands.slice(0, 10).map(b => `
    <div class="form-check">
      <input class="form-check-input brand-checkbox" type="checkbox" value="${b}" id="brand-${b.replace(/\s+/g, '')}" onchange="applyFilters()">
      <label class="form-check-label small" for="brand-${b.replace(/\s+/g, '')}">${b}</label>
    </div>
  `).join('');
}

function renderPagination(current, totalPages) {
  const pagination = document.getElementById('catalog-pagination');
  if (!pagination || totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  let html = `
    <li class="page-item ${current === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="fetchProducts(${current - 1}); return false;">Previous</a>
    </li>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <li class="page-item ${i === current ? 'active' : ''}">
        <a class="page-link" href="#" onclick="fetchProducts(${i}); return false;">${i}</a>
      </li>
    `;
  }

  html += `
    <li class="page-item ${current === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="fetchProducts(${current + 1}); return false;">Next</a>
    </li>
  `;

  pagination.innerHTML = html;
}

function applyFilters() {
  fetchProducts(1);
}

function resetFilters() {
  document.getElementById('filter-category').value = '';
  document.getElementById('filter-subcategory').value = '';
  document.getElementById('filter-min-price').value = '';
  document.getElementById('filter-max-price').value = '';
  document.getElementById('filter-in-stock').checked = false;
  document.getElementById('rAll').checked = true;
  document.getElementById('sort-select').value = 'newest';

  const brandCbs = document.querySelectorAll('.brand-checkbox');
  brandCbs.forEach(cb => cb.checked = false);

  window.history.pushState({}, '', '/products.html');
  fetchProducts(1);
}
