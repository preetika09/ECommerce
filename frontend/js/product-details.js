/* ==========================================================================
   ShopVerse - Product Details Controller Script
   ========================================================================== */

let currentProduct = null;
let selectedSize = '';
let selectedColor = '';
let currentQuantity = 1;

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    window.location.href = '/products.html';
    return;
  }

  loadProductDetails(productId);
  loadReviews(productId);
});

async function loadProductDetails(productId) {
  const container = document.getElementById('product-details-container');
  try {
    const res = await apiFetch(`/products/${productId}`);
    if (!res.success) throw new Error(res.message);

    const p = res.product;
    currentProduct = p;

    document.getElementById('pd-breadcrumb-title').textContent = p.name;
    document.title = `${p.name} - ShopVerse`;

    // Pre-select first size & color if available
    selectedSize = p.sizes && p.sizes.length > 0 ? p.sizes[0] : '';
    selectedColor = p.colors && p.colors.length > 0 ? p.colors[0] : '';

    container.innerHTML = `
      <!-- Gallery Column -->
      <div class="col-md-6 col-lg-5">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden p-3 bg-white">
          <img id="main-product-img" src="${p.images[0] || 'https://via.placeholder.com/500'}" class="img-fluid rounded-3 mb-3 w-100" style="object-fit: cover; max-height: 420px;" alt="${p.name}">
          ${p.images.length > 1 ? `
            <div class="d-flex gap-2 overflow-x-auto pb-2">
              ${p.images.map((img, idx) => `
                <img src="${img}" class="img-thumbnail rounded-3 cursor-pointer ${idx === 0 ? 'border-primary' : ''}" style="width: 70px; height: 70px; object-fit: cover;" onclick="switchMainImage(this, '${img}')">
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Details Column -->
      <div class="col-md-6 col-lg-7 d-flex flex-column justify-content-between">
        <div>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-primary-subtle text-primary fw-bold px-3 py-2 uppercase">${p.brand}</span>
            <span class="badge ${p.stock > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} fw-bold">
              ${p.stock > 0 ? `In Stock (${p.stock} units)` : 'Out of Stock'}
            </span>
          </div>

          <h2 class="fw-bold mb-2">${p.name}</h2>

          <div class="d-flex align-items-center gap-2 mb-3">
            <div class="badge bg-warning text-dark px-2 py-1 fs-6">
              <i class="fa-solid fa-star me-1"></i>${p.rating}
            </div>
            <span class="text-muted small">(${p.numReviews} Verified Customer Reviews)</span>
          </div>

          <div class="d-flex align-items-baseline gap-3 mb-4">
            <h1 class="fw-extrabold text-primary mb-0">₹${p.price}</h1>
            ${p.originalPrice > p.price ? `<span class="text-decoration-line-through text-muted fs-5">₹${p.originalPrice}</span>` : ''}
            ${p.discount > 0 ? `<span class="badge bg-danger fs-6">${p.discount}% OFF</span>` : ''}
          </div>

          <!-- Offers Card -->
          <div class="p-3 bg-body-tertiary rounded-3 mb-4">
            <h6 class="fw-bold mb-2"><i class="fa-solid fa-tags text-danger me-2"></i>Available Bank Offers:</h6>
            <ul class="small mb-0 text-muted ps-3">
              <li>Bank Offer: 10% Instant Discount on HDFC Credit Cards up to ₹1,500.</li>
              <li>Partner Offer: Free Shipping & Express Delivery on orders over ₹999.</li>
            </ul>
          </div>

          <!-- Size Selector -->
          ${p.sizes && p.sizes.length > 0 ? `
            <div class="mb-4">
              <label class="form-label fw-bold">Select Size:</label>
              <div class="d-flex flex-wrap gap-2" id="size-selector-box">
                ${p.sizes.map((s, idx) => `
                  <button type="button" class="btn btn-sm ${idx === 0 ? 'btn-primary' : 'btn-outline-secondary'} px-3 fw-bold size-btn" onclick="selectSize('${s}', this)">${s}</button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Color Selector -->
          ${p.colors && p.colors.length > 0 ? `
            <div class="mb-4">
              <label class="form-label fw-bold">Select Color:</label>
              <div class="d-flex flex-wrap gap-2" id="color-selector-box">
                ${p.colors.map((c, idx) => `
                  <button type="button" class="btn btn-sm ${idx === 0 ? 'btn-dark' : 'btn-outline-dark'} px-3 color-btn" onclick="selectColor('${c}', this)">${c}</button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Quantity Selector -->
          <div class="mb-4">
            <label class="form-label fw-bold">Quantity:</label>
            <div class="input-group" style="width: 140px;">
              <button class="btn btn-outline-secondary" type="button" onclick="adjustQty(-1)"><i class="fa-solid fa-minus"></i></button>
              <input type="text" class="form-control text-center fw-bold" id="pd-qty-input" value="1" readonly>
              <button class="btn btn-outline-secondary" type="button" onclick="adjustQty(1)"><i class="fa-solid fa-plus"></i></button>
            </div>
          </div>

        </div>

        <!-- Action Buttons -->
        <div class="d-flex flex-wrap gap-3 mt-4">
          <button onclick="handleAddToCart()" class="btn btn-primary btn-lg flex-grow-1 fw-bold"><i class="fa-solid fa-cart-shopping me-2"></i>Add to Cart</button>
          <button onclick="handleBuyNow()" class="btn btn-warning btn-lg flex-grow-1 fw-bold text-dark"><i class="fa-solid fa-bolt me-2"></i>Buy Now</button>
          <button onclick="toggleWishlist('${p._id}', this)" class="btn btn-outline-danger btn-lg px-4"><i class="fa-solid fa-heart"></i></button>
        </div>

      </div>
    `;

    // Populate Tab Content
    document.getElementById('pd-full-description').textContent = p.description;

    const specsTable = document.getElementById('pd-specs-table').querySelector('tbody');
    if (p.specifications && Object.keys(p.specifications).length > 0) {
      specsTable.innerHTML = Object.entries(p.specifications).map(([key, val]) => `
        <tr><th class="w-25 text-muted">${key}</th><td>${val}</td></tr>
      `).join('');
    } else {
      specsTable.innerHTML = `<tr><td class="text-muted">Standard product specifications apply.</td></tr>`;
    }

    // Render Similar Products
    if (res.similarProducts) {
      document.getElementById('similar-products-grid').innerHTML = res.similarProducts.map(sp => `
        <div class="col">
          <div class="product-card">
            <a href="/product-details.html?id=${sp._id}" class="product-img-wrapper">
              <img src="${sp.images[0] || 'https://via.placeholder.com/300'}" alt="${sp.name}">
            </a>
            <div class="product-body">
              <div class="product-brand">${sp.brand}</div>
              <a href="/product-details.html?id=${sp._id}" class="product-title">${sp.name}</a>
              <div class="product-price-box">
                <span class="current-price">₹${sp.price}</span>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

  } catch (err) {
    container.innerHTML = `<div class="col-12 alert alert-danger">${err.message}</div>`;
  }
}

function switchMainImage(thumbEl, imgUrl) {
  document.getElementById('main-product-img').src = imgUrl;
  document.querySelectorAll('.img-thumbnail').forEach(el => el.classList.remove('border-primary'));
  thumbEl.classList.add('border-primary');
}

function selectSize(size, btnEl) {
  selectedSize = size;
  document.querySelectorAll('.size-btn').forEach(btn => btn.className = 'btn btn-sm btn-outline-secondary px-3 fw-bold size-btn');
  btnEl.className = 'btn btn-sm btn-primary px-3 fw-bold size-btn';
}

function selectColor(color, btnEl) {
  selectedColor = color;
  document.querySelectorAll('.color-btn').forEach(btn => btn.className = 'btn btn-sm btn-outline-dark px-3 color-btn');
  btnEl.className = 'btn btn-sm btn-dark px-3 color-btn';
}

function adjustQty(delta) {
  const input = document.getElementById('pd-qty-input');
  let qty = parseInt(input.value) + delta;
  if (qty < 1) qty = 1;
  if (currentProduct && qty > currentProduct.stock) {
    showToast(`Only ${currentProduct.stock} items available in stock`, 'info');
    return;
  }
  input.value = qty;
  currentQuantity = qty;
}

async function handleAddToCart() {
  if (!currentProduct) return;
  await addToCart(currentProduct._id, currentQuantity, selectedSize, selectedColor);
}

async function handleBuyNow() {
  if (!currentProduct) return;
  await addToCart(currentProduct._id, currentQuantity, selectedSize, selectedColor);
  window.location.href = '/checkout.html';
}

// --------------------------------------------------------------------------
// Reviews Handling
// --------------------------------------------------------------------------
async function loadReviews(productId) {
  const listContainer = document.getElementById('reviews-list-container');
  try {
    const res = await apiFetch(`/products/${productId}/reviews`);
    if (res.success && res.reviews.length > 0) {
      listContainer.innerHTML = res.reviews.map(r => `
        <div class="card border-0 bg-body-tertiary p-3 rounded-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <div class="fw-bold">${r.userName}</div>
            <span class="text-muted small">${new Date(r.createdAt).toLocaleDateString()}</span>
          </div>
          <div class="text-warning small mb-2">
            ${Array(r.rating).fill('<i class="fa-solid fa-star"></i>').join('')}
          </div>
          <p class="mb-0 text-muted small">${r.comment}</p>
        </div>
      `).join('');
    } else {
      listContainer.innerHTML = `<p class="text-muted">No reviews yet for this product. Be the first to leave a review!</p>`;
    }
  } catch (err) {
    console.error('Error loading reviews:', err);
  }
}

document.getElementById('submit-review-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!isAuthenticated()) {
    showToast('Please login to submit a review', 'info');
    setTimeout(() => window.location.href = '/login.html', 1000);
    return;
  }

  const rating = document.getElementById('review-rating').value;
  const comment = document.getElementById('review-comment').value.trim();
  const productId = currentProduct._id;

  try {
    const res = await apiFetch(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment })
    });

    if (res.success) {
      showToast('Thank you! Your review has been published.', 'success');
      document.getElementById('review-comment').value = '';
      loadReviews(productId);
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
});
