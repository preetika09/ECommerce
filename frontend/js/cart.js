/* ==========================================================================
   ShopVerse - Shopping Cart Controller Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (!isAuthenticated()) {
    renderEmptyCart('Please login to view your shopping cart');
    return;
  }

  loadCart();
});

async function loadCart() {
  const container = document.getElementById('cart-main-container');
  try {
    const res = await apiFetch('/cart');
    if (!res.success || !res.cart || res.cart.items.length === 0) {
      renderEmptyCart('Your shopping cart is currently empty');
      return;
    }

    const cart = res.cart;
    let subtotal = 0;

    const itemsHtml = cart.items.map(item => {
      const p = item.product;
      if (!p) return '';
      const itemTotal = p.price * item.quantity;
      subtotal += itemTotal;

      return `
        <div class="card border-0 shadow-sm mb-3 rounded-4 p-3">
          <div class="row align-items-center g-3">
            <div class="col-3 col-md-2">
              <img src="${p.images[0] || 'https://via.placeholder.com/100'}" class="img-fluid rounded-3" alt="${p.name}" style="object-fit: cover; height: 90px; width: 90px;">
            </div>

            <div class="col-9 col-md-4">
              <span class="badge bg-primary-subtle text-primary mb-1 small">${p.brand}</span>
              <h6 class="fw-bold mb-1 text-truncate">${p.name}</h6>
              <div class="small text-muted mb-1">
                ${item.selectedSize ? `<span class="me-2">Size: <strong>${item.selectedSize}</strong></span>` : ''}
                ${item.selectedColor ? `<span>Color: <strong>${item.selectedColor}</strong></span>` : ''}
              </div>
              <div class="fw-bold text-primary">₹${p.price}</div>
            </div>

            <div class="col-6 col-md-3">
              <div class="input-group input-group-sm" style="max-width: 120px;">
                <button class="btn btn-outline-secondary" onclick="updateCartQuantity('${p._id}', ${item.quantity - 1})"><i class="fa-solid fa-minus"></i></button>
                <input type="text" class="form-control text-center fw-bold bg-white" value="${item.quantity}" readonly>
                <button class="btn btn-outline-secondary" onclick="updateCartQuantity('${p._id}', ${item.quantity + 1})"><i class="fa-solid fa-plus"></i></button>
              </div>
            </div>

            <div class="col-6 col-md-3 text-end">
              <div class="fw-extrabold fs-5 text-dark mb-2">₹${itemTotal}</div>
              <div class="d-flex justify-content-end gap-2">
                <button onclick="moveToWishlist('${p._id}')" class="btn btn-link btn-sm text-secondary p-0" title="Move to Wishlist"><i class="fa-solid fa-heart me-1"></i>Save</button>
                <button onclick="removeCartItem('${p._id}')" class="btn btn-link btn-sm text-danger p-0 ms-2" title="Remove"><i class="fa-solid fa-trash me-1"></i>Remove</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const tax = Math.round(subtotal * 0.05);
    const shipping = subtotal > 999 ? 0 : 70;
    const finalTotal = subtotal + tax + shipping;

    container.innerHTML = `
      <!-- Cart Items List -->
      <div class="col-lg-8">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-muted">${cart.items.length} Items in your cart</span>
          <button onclick="clearEntireCart()" class="btn btn-outline-danger btn-sm"><i class="fa-solid fa-trash-can me-1"></i>Clear Cart</button>
        </div>
        ${itemsHtml}
      </div>

      <!-- Order Summary Card -->
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 sticky-top" style="top: 90px;">
          <h5 class="fw-bold mb-3 border-bottom pb-2">Order Summary</h5>
          
          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Subtotal</span>
            <span class="fw-semibold">₹${subtotal}</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Estimated Tax (5%)</span>
            <span class="fw-semibold">₹${tax}</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Shipping Fee</span>
            <span class="fw-semibold">${shipping === 0 ? '<span class="text-success">FREE</span>' : '₹' + shipping}</span>
          </div>

          ${subtotal <= 999 ? `
            <div class="alert alert-info py-2 small my-2">
              <i class="fa-solid fa-truck me-1"></i>Add ₹${1000 - subtotal} more for FREE shipping!
            </div>
          ` : ''}

          <hr>

          <div class="d-flex justify-content-between mb-4">
            <span class="fw-bold fs-5">Final Total</span>
            <span class="fw-extrabold fs-4 text-primary">₹${finalTotal}</span>
          </div>

          <a href="/checkout.html" class="btn btn-primary btn-lg w-100 fw-bold shadow-sm">
            Proceed to Checkout <i class="fa-solid fa-arrow-right ms-2"></i>
          </a>
        </div>
      </div>
    `;

  } catch (err) {
    container.innerHTML = `<div class="col-12 alert alert-danger">${err.message}</div>`;
  }
}

function renderEmptyCart(message) {
  const container = document.getElementById('cart-main-container');
  container.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="mb-3 text-muted"><i class="fa-solid fa-cart-arrow-down fa-4x"></i></div>
      <h4 class="fw-bold">${message}</h4>
      <p class="text-muted small">Explore our multi-category marketplace and fill it up with great deals.</p>
      <a href="/products.html" class="btn btn-primary btn-lg rounded-pill px-4 fw-bold mt-2">
        <i class="fa-solid fa-bag-shopping me-2"></i>Start Shopping
      </a>
    </div>
  `;
}

async function updateCartQuantity(productId, newQty) {
  try {
    await apiFetch(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity: newQty })
    });
    loadCart();
    updateNavbarBadges();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function removeCartItem(productId) {
  try {
    await apiFetch(`/cart/${productId}`, { method: 'DELETE' });
    showToast('Item removed from cart', 'info');
    loadCart();
    updateNavbarBadges();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function moveToWishlist(productId) {
  try {
    await apiFetch(`/wishlist/${productId}`, { method: 'POST' });
    await apiFetch(`/cart/${productId}`, { method: 'DELETE' });
    showToast('Moved item to Wishlist!', 'success');
    loadCart();
    updateNavbarBadges();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function clearEntireCart() {
  if (!confirm('Are you sure you want to clear your cart?')) return;
  try {
    await apiFetch('/cart', { method: 'DELETE' });
    showToast('Cart cleared', 'info');
    loadCart();
    updateNavbarBadges();
  } catch (err) {
    showToast(err.message, 'error');
  }
}
