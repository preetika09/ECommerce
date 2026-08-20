/* ==========================================================================
   ShopVerse - Checkout Controller Script
   ========================================================================== */

let cartItems = [];
let userAddresses = [];
let selectedAddress = null;
let selectedDeliveryMethod = 'Standard';

document.addEventListener('DOMContentLoaded', () => {
  if (!isAuthenticated()) {
    showToast('Please login to complete checkout', 'info');
    setTimeout(() => window.location.href = '/login.html', 1000);
    return;
  }

  loadCheckoutData();
});

async function loadCheckoutData() {
  try {
    // 1. Fetch User Profile for Addresses
    const userRes = await apiFetch('/auth/me');
    if (userRes.success) {
      userAddresses = userRes.user.addresses || [];
      renderSavedAddresses();
    }

    // 2. Fetch Cart Items
    const cartRes = await apiFetch('/cart');
    if (!cartRes.success || !cartRes.cart || cartRes.cart.items.length === 0) {
      showToast('Your cart is empty', 'info');
      setTimeout(() => window.location.href = '/cart.html', 1000);
      return;
    }

    cartItems = cartRes.cart.items;
    renderOrderSummary();

  } catch (err) {
    showToast(err.message, 'error');
  }
}

function renderSavedAddresses() {
  const box = document.getElementById('saved-addresses-box');
  if (!box) return;

  if (userAddresses.length === 0) {
    box.innerHTML = `
      <div class="alert alert-warning mb-0">
        No saved addresses found. Please click <strong>"Add New Address"</strong> below to proceed.
      </div>
    `;
    toggleNewAddressForm(true);
    return;
  }

  // Pre-select default address or first address
  if (!selectedAddress) {
    selectedAddress = userAddresses.find(a => a.isDefault) || userAddresses[0];
  }

  box.innerHTML = userAddresses.map((addr, idx) => `
    <div class="card p-3 border rounded-3 cursor-pointer ${selectedAddress._id === addr._id ? 'border-primary bg-primary-subtle' : ''}" onclick="selectAddressById('${addr._id}')">
      <div class="form-check d-flex justify-content-between align-items-start">
        <div>
          <input class="form-check-input me-2" type="radio" name="addrSelect" id="addr-${idx}" ${selectedAddress._id === addr._id ? 'checked' : ''}>
          <label class="form-check-label fw-bold" for="addr-${idx}">
            ${addr.fullName} <span class="text-muted fw-normal">(${addr.phone})</span>
            ${addr.isDefault ? '<span class="badge bg-secondary ms-2">Default</span>' : ''}
          </label>
          <div class="text-muted small mt-1">
            ${addr.house}, ${addr.street}, ${addr.city}, ${addr.state} - <strong>${addr.pincode}</strong>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function selectAddressById(id) {
  selectedAddress = userAddresses.find(a => a._id === id);
  renderSavedAddresses();
}

function toggleNewAddressForm(forceShow = false) {
  const form = document.getElementById('new-address-form');
  if (!form) return;

  if (forceShow || form.classList.contains('d-none')) {
    form.classList.remove('d-none');
  } else {
    form.classList.add('d-none');
  }
}

document.getElementById('new-address-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const addressData = {
    fullName: document.getElementById('addr-name').value.trim(),
    phone: document.getElementById('addr-phone').value.trim(),
    house: document.getElementById('addr-house').value.trim(),
    street: document.getElementById('addr-street').value.trim(),
    city: document.getElementById('addr-city').value.trim(),
    state: document.getElementById('addr-state').value.trim(),
    pincode: document.getElementById('addr-pincode').value.trim(),
    isDefault: true
  };

  try {
    const res = await apiFetch('/auth/address', {
      method: 'POST',
      body: JSON.stringify(addressData)
    });

    if (res.success) {
      showToast('Address added successfully!', 'success');
      userAddresses = res.addresses;
      selectedAddress = userAddresses[userAddresses.length - 1];
      renderSavedAddresses();
      toggleNewAddressForm(false);
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
});

function selectDeliveryMethod(method) {
  selectedDeliveryMethod = method;
  document.getElementById('delStandard').checked = (method === 'Standard');
  document.getElementById('delExpress').checked = (method === 'Express');
  renderOrderSummary();
}

function renderOrderSummary() {
  const summaryBox = document.getElementById('checkout-items-summary');
  if (!summaryBox) return;

  let subtotal = 0;
  summaryBox.innerHTML = cartItems.map(item => {
    const p = item.product;
    if (!p) return '';
    const itemTotal = p.price * item.quantity;
    subtotal += itemTotal;

    return `
      <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-2">
          <img src="${p.images[0] || 'https://via.placeholder.com/40'}" style="width: 40px; height: 40px; object-fit: cover;" class="rounded-2">
          <div>
            <div class="fw-semibold text-truncate small" style="max-width: 170px;">${p.name}</div>
            <span class="text-muted small">Qty: ${item.quantity}</span>
          </div>
        </div>
        <span class="fw-bold small">₹${itemTotal}</span>
      </div>
    `;
  }).join('');

  const tax = Math.round(subtotal * 0.05);
  const shipping = selectedDeliveryMethod === 'Express' ? 150 : (subtotal > 999 ? 0 : 70);
  const total = subtotal + tax + shipping;

  document.getElementById('co-subtotal').textContent = `₹${subtotal}`;
  document.getElementById('co-tax').textContent = `₹${tax}`;
  document.getElementById('co-shipping').innerHTML = shipping === 0 ? '<span class="text-success">FREE</span>' : `₹${shipping}`;
  document.getElementById('co-total').textContent = `₹${total}`;
}

async function placeOrder() {
  if (!selectedAddress) {
    showToast('Please select or add a delivery address', 'error');
    return;
  }

  const paymentRadio = document.querySelector('input[name="paymentMethod"]:checked');
  const paymentMethod = paymentRadio ? paymentRadio.value : 'Cash on Delivery';

  const orderData = {
    items: cartItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      selectedSize: item.selectedSize || '',
      selectedColor: item.selectedColor || ''
    })),
    shippingAddress: {
      fullName: selectedAddress.fullName,
      phone: selectedAddress.phone,
      house: selectedAddress.house,
      street: selectedAddress.street,
      city: selectedAddress.city,
      state: selectedAddress.state,
      pincode: selectedAddress.pincode
    },
    deliveryMethod: selectedDeliveryMethod,
    paymentMethod
  };

  try {
    const res = await apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });

    if (res.success) {
      showToast('🎉 Order placed successfully!', 'success');
      updateNavbarBadges();
      setTimeout(() => {
        window.location.href = `/orders.html`;
      }, 1200);
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}
