/* ==========================================================================
   ShopVerse - Core Frontend Application Framework & Utility Suite
   ========================================================================== */

const API_BASE_URL = '/api';

// --------------------------------------------------------------------------
// 1. Authentication & Session Storage Helpers
// --------------------------------------------------------------------------
function getToken() {
  return localStorage.getItem('shopverse_token');
}

function getUser() {
  const user = localStorage.getItem('shopverse_user');
  return user ? JSON.parse(user) : null;
}

function setSession(token, user) {
  localStorage.setItem('shopverse_token', token);
  localStorage.setItem('shopverse_user', JSON.stringify(user));
  updateAuthUI();
  updateNavbarBadges();
}

function logoutUser() {
  localStorage.removeItem('shopverse_token');
  localStorage.removeItem('shopverse_user');
  showToast('Logged out successfully', 'info');
  setTimeout(() => {
    window.location.href = '/login.html';
  }, 800);
}

function isAuthenticated() {
  return !!getToken();
}

function isAdmin() {
  const user = getUser();
  return user && user.role === 'admin';
}

// --------------------------------------------------------------------------
// 2. Universal API Fetch Wrapper
// --------------------------------------------------------------------------
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If uploading FormData, delete Content-Type so browser sets boundary automatically
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred during API request');
    }
    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err.message);
    throw err;
  }
}

// --------------------------------------------------------------------------
// 3. Toast Notifications Engine
// --------------------------------------------------------------------------
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const iconMap = {
    success: 'fa-circle-check text-success',
    error: 'fa-circle-xmark text-danger',
    info: 'fa-circle-info text-primary'
  };

  const toast = document.createElement('div');
  toast.className = `custom-toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${iconMap[type] || 'fa-bell'} fa-lg"></i>
    <span class="fw-medium">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

// --------------------------------------------------------------------------
// 4. Dark Mode Theme Switcher
// --------------------------------------------------------------------------
function initTheme() {
  const savedTheme = localStorage.getItem('shopverse_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('shopverse_theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const icons = document.querySelectorAll('.theme-toggle-icon');
  icons.forEach(icon => {
    if (theme === 'dark') {
      icon.className = 'theme-toggle-icon fa-solid fa-sun text-warning';
    } else {
      icon.className = 'theme-toggle-icon fa-solid fa-moon text-secondary';
    }
  });
}

// --------------------------------------------------------------------------
// 5. Dynamic Navbar Badges & Auth UI Update
// --------------------------------------------------------------------------
async function updateNavbarBadges() {
  const cartBadge = document.getElementById('cart-badge-count');
  const wishlistBadge = document.getElementById('wishlist-badge-count');

  if (isAuthenticated()) {
    try {
      const cartRes = await apiFetch('/cart');
      if (cartRes.success && cartBadge) {
        const count = cartRes.cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = count;
        cartBadge.style.display = count > 0 ? 'inline-block' : 'none';
      }

      const wishlistRes = await apiFetch('/wishlist');
      if (wishlistRes.success && wishlistBadge) {
        const count = wishlistRes.wishlist.products.length;
        wishlistBadge.textContent = count;
        wishlistBadge.style.display = count > 0 ? 'inline-block' : 'none';
      }
    } catch (e) {
      console.warn('Failed to fetch badge counts:', e.message);
    }
  } else {
    if (cartBadge) cartBadge.style.display = 'none';
    if (wishlistBadge) wishlistBadge.style.display = 'none';
  }
}

function updateAuthUI() {
  const authContainer = document.getElementById('auth-nav-container');
  if (!authContainer) return;

  const user = getUser();
  if (user) {
    authContainer.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-outline-primary btn-sm dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
          <i class="fa-solid fa-circle-user fa-lg"></i>
          <span>${user.name.split(' ')[0]}</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow">
          <li><a class="dropdown-item" href="/profile.html"><i class="fa-solid fa-user me-2 text-primary"></i>My Profile</a></li>
          <li><a class="dropdown-item" href="/orders.html"><i class="fa-solid fa-box me-2 text-success"></i>My Orders</a></li>
          <li><a class="dropdown-item" href="/wishlist.html"><i class="fa-solid fa-heart me-2 text-danger"></i>Wishlist</a></li>
          ${user.role === 'admin' ? '<li><hr class="dropdown-divider"></li><li><a class="dropdown-item text-warning fw-bold" href="/admin/dashboard.html"><i class="fa-solid fa-gauge me-2"></i>Admin Dashboard</a></li>' : ''}
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" onclick="logoutUser()"><i class="fa-solid fa-right-from-bracket me-2"></i>Logout</a></li>
        </ul>
      </div>
    `;
  } else {
    authContainer.innerHTML = `
      <a href="/login.html" class="btn btn-outline-primary btn-sm fw-semibold me-2">Login</a>
      <a href="/register.html" class="btn btn-primary btn-sm fw-semibold">Register</a>
    `;
  }
}

// --------------------------------------------------------------------------
// 6. Global Live Search & Autocomplete
// --------------------------------------------------------------------------
function setupGlobalSearch() {
  const searchInput = document.getElementById('global-search-input');
  const suggestionsBox = document.getElementById('search-suggestions-box');
  const searchForm = document.getElementById('global-search-form');

  if (!searchInput) return;

  let debounceTimer;

  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim();

    if (query.length < 2) {
      if (suggestionsBox) suggestionsBox.style.display = 'none';
      return;
    }

    debounceTimer = setTimeout(async () => {
      try {
        const res = await apiFetch(`/products/search?q=${encodeURIComponent(query)}`);
        if (res.success && res.products.length > 0 && suggestionsBox) {
          suggestionsBox.innerHTML = res.products.map(prod => `
            <div class="search-suggestion-item" onclick="window.location.href='/product-details.html?id=${prod._id}'">
              <img src="${prod.images[0] || 'https://via.placeholder.com/40'}" alt="${prod.name}">
              <div>
                <div class="fw-semibold text-truncate" style="max-width: 320px;">${prod.name}</div>
                <small class="text-muted">${prod.category} • ₹${prod.price}</small>
              </div>
            </div>
          `).join('');
          suggestionsBox.style.display = 'block';
        } else if (suggestionsBox) {
          suggestionsBox.innerHTML = `<div class="p-3 text-center text-muted">No products found for "${query}"</div>`;
          suggestionsBox.style.display = 'block';
        }
      } catch (err) {
        console.error('Search suggestion error:', err);
      }
    }, 300);
  });

  document.addEventListener('click', (e) => {
    if (suggestionsBox && !searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
      suggestionsBox.style.display = 'none';
    }
  });

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = searchInput.value.trim();
      if (q) {
        window.location.href = `/products.html?search=${encodeURIComponent(q)}`;
      }
    });
  }
}

// --------------------------------------------------------------------------
// 7. Quick View Modal Dialog Generator
// --------------------------------------------------------------------------
async function openQuickView(productId) {
  try {
    const res = await apiFetch(`/products/${productId}`);
    if (!res.success) return;
    const p = res.product;

    let modal = document.getElementById('quickViewModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal fade';
      modal.id = 'quickViewModal';
      modal.tabIndex = -1;
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="row g-4">
              <div class="col-md-6">
                <img src="${p.images[0]}" class="img-fluid rounded-3 shadow-sm w-100" style="object-fit: cover; max-height: 350px;">
              </div>
              <div class="col-md-6 d-flex flex-column justify-content-between">
                <div>
                  <span class="badge bg-primary mb-2">${p.brand}</span>
                  <h4 class="fw-bold mb-2">${p.name}</h4>
                  <div class="text-warning mb-2">
                    <i class="fa-solid fa-star"></i> ${p.rating} <span class="text-muted font-normal">(${p.numReviews} reviews)</span>
                  </div>
                  <div class="d-flex align-items-baseline gap-2 mb-3">
                    <h3 class="fw-bold text-primary mb-0">₹${p.price}</h3>
                    <span class="text-decoration-line-through text-muted">₹${p.originalPrice}</span>
                    <span class="badge bg-danger">${p.discount}% OFF</span>
                  </div>
                  <p class="text-muted small">${p.description}</p>
                </div>
                <div class="d-grid gap-2">
                  <button onclick="addToCart('${p._id}')" class="btn btn-primary fw-semibold"><i class="fa-solid fa-cart-shopping me-2"></i>Add to Cart</button>
                  <a href="/product-details.html?id=${p._id}" class="btn btn-outline-secondary fw-semibold">View Full Details</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// --------------------------------------------------------------------------
// 8. Add to Cart & Add to Wishlist Quick Actions
// --------------------------------------------------------------------------
async function addToCart(productId, quantity = 1, selectedSize = '', selectedColor = '') {
  if (!isAuthenticated()) {
    showToast('Please login to add products to your cart', 'info');
    setTimeout(() => window.location.href = '/login.html', 1000);
    return;
  }

  try {
    const res = await apiFetch('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, selectedSize, selectedColor })
    });

    if (res.success) {
      showToast('Product added to cart successfully!', 'success');
      updateNavbarBadges();
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function toggleWishlist(productId, btnElement) {
  if (!isAuthenticated()) {
    showToast('Please login to save items to your wishlist', 'info');
    setTimeout(() => window.location.href = '/login.html', 1000);
    return;
  }

  try {
    const wishlistRes = await apiFetch('/wishlist');
    const exists = wishlistRes.wishlist.products.some(p => p._id === productId || p === productId);

    if (exists) {
      await apiFetch(`/wishlist/${productId}`, { method: 'DELETE' });
      showToast('Item removed from wishlist', 'info');
      if (btnElement) btnElement.classList.remove('active', 'text-danger');
    } else {
      await apiFetch(`/wishlist/${productId}`, { method: 'POST' });
      showToast('Product added to wishlist!', 'success');
      if (btnElement) btnElement.classList.add('active', 'text-danger');
    }
    updateNavbarBadges();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// --------------------------------------------------------------------------
// 9. Document Initializer
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateAuthUI();
  updateNavbarBadges();
  setupGlobalSearch();
});
