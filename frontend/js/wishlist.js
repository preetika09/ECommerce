/* ==========================================================================
   ShopVerse - Wishlist Controller Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (!isAuthenticated()) {
    renderEmptyWishlist('Please login to view your wishlist');
    return;
  }

  loadWishlist();
});

async function loadWishlist() {
  const grid = document.getElementById('wishlist-grid');
  try {
    const res = await apiFetch('/wishlist');
    if (!res.success || !res.wishlist || res.wishlist.products.length === 0) {
      renderEmptyWishlist('Your wishlist is currently empty');
      return;
    }

    const products = res.wishlist.products;
    grid.innerHTML = products.map(p => `
      <div class="col">
        <div class="product-card">
          ${p.discount > 0 ? `<span class="product-badge-discount">-${p.discount}%</span>` : ''}
          <button class="wishlist-btn-overlay active text-danger" onclick="removeFromWishlist('${p._id}')" title="Remove from Wishlist">
            <i class="fa-solid fa-heart"></i>
          </button>
          
          <a href="/product-details.html?id=${p._id}" class="product-img-wrapper">
            <img src="${p.images[0] || 'https://via.placeholder.com/300'}" alt="${p.name}">
          </a>

          <div class="product-body">
            <div class="product-brand">${p.brand}</div>
            <a href="/product-details.html?id=${p._id}" class="product-title">${p.name}</a>
            
            <div class="product-price-box">
              <span class="current-price">₹${p.price}</span>
              ${p.originalPrice > p.price ? `<span class="original-price">₹${p.originalPrice}</span>` : ''}
            </div>

            <div class="product-actions-btn mt-3">
              <button onclick="moveWishlistItemToCart('${p._id}')" class="btn btn-primary btn-sm w-100 fw-bold">
                <i class="fa-solid fa-cart-plus me-1"></i> Move to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

  } catch (err) {
    grid.innerHTML = `<div class="col-12 alert alert-danger">${err.message}</div>`;
  }
}

function renderEmptyWishlist(msg) {
  const grid = document.getElementById('wishlist-grid');
  grid.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="mb-3 text-muted"><i class="fa-solid fa-heart-crack fa-4x"></i></div>
      <h4 class="fw-bold">${msg}</h4>
      <p class="text-muted small">Save items you love to view or buy them anytime later.</p>
      <a href="/products.html" class="btn btn-primary btn-lg rounded-pill px-4 fw-bold mt-2">Discover Products</a>
    </div>
  `;
}

async function removeFromWishlist(productId) {
  try {
    await apiFetch(`/wishlist/${productId}`, { method: 'DELETE' });
    showToast('Item removed from wishlist', 'info');
    loadWishlist();
    updateNavbarBadges();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function moveWishlistItemToCart(productId) {
  try {
    await addToCart(productId);
    await removeFromWishlist(productId);
    showToast('Product moved to cart!', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  }
}
