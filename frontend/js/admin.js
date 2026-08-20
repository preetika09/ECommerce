/* ==========================================================================
   ShopVerse - Admin Control Panel Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (!isAuthenticated() || !isAdmin()) {
    showToast('Access denied: Admin privileges required', 'error');
    setTimeout(() => window.location.href = '/login.html', 1000);
    return;
  }
});

// --------------------------------------------------------------------------
// 1. Dashboard Metrics Loader
// --------------------------------------------------------------------------
async function loadDashboardMetrics() {
  try {
    const res = await apiFetch('/admin/dashboard');
    if (!res.success) return;

    document.getElementById('kpi-revenue').textContent = `₹${res.stats.totalRevenue.toLocaleString()}`;
    document.getElementById('kpi-orders').textContent = res.stats.totalOrders;
    document.getElementById('kpi-products').textContent = res.stats.totalProducts;
    document.getElementById('kpi-users').textContent = res.stats.totalUsers;

    // Recent Orders Table
    const recentBody = document.getElementById('recent-orders-tbody');
    if (recentBody) {
      if (res.recentOrders.length === 0) {
        recentBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No orders placed yet</td></tr>`;
      } else {
        recentBody.innerHTML = res.recentOrders.map(o => `
          <tr>
            <td><strong class="text-primary">${o.orderNumber}</strong></td>
            <td>${o.user ? o.user.name : 'Guest'}</td>
            <td>₹${o.totalAmount}</td>
            <td><span class="badge bg-secondary">${o.orderStatus}</span></td>
          </tr>
        `).join('');
      }
    }

    // Low Stock Alert Table
    const lowStockBody = document.getElementById('low-stock-tbody');
    if (lowStockBody) {
      if (res.lowStockProducts.length === 0) {
        lowStockBody.innerHTML = `<tr><td colspan="3" class="text-center text-success">All products adequately stocked!</td></tr>`;
      } else {
        lowStockBody.innerHTML = res.lowStockProducts.map(p => `
          <tr>
            <td class="fw-semibold">${p.name}</td>
            <td><span class="badge bg-light text-dark">${p.category}</span></td>
            <td class="text-end"><span class="badge bg-danger">${p.stock} left</span></td>
          </tr>
        `).join('');
      }
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// --------------------------------------------------------------------------
// 2. Admin Products CRUD Handler
// --------------------------------------------------------------------------
let adminProductsList = [];

async function loadAdminProducts() {
  const tbody = document.getElementById('admin-products-tbody');
  if (!tbody) return;

  try {
    const res = await apiFetch('/products?limit=100');
    if (res.success) {
      adminProductsList = res.products;
      tbody.innerHTML = res.products.map(p => `
        <tr>
          <td><img src="${p.images[0] || 'https://via.placeholder.com/40'}" style="width: 40px; height: 40px; object-fit: cover;" class="rounded-2"></td>
          <td class="fw-bold">${p.name}</td>
          <td><span class="badge bg-light text-dark">${p.category}</span></td>
          <td>${p.brand}</td>
          <td>₹${p.price} <small class="text-decoration-line-through text-muted ms-1">₹${p.originalPrice}</small></td>
          <td><span class="badge ${p.stock <= 5 ? 'bg-danger' : 'bg-success'}">${p.stock}</span></td>
          <td>
            <button onclick="editProductModal('${p._id}')" class="btn btn-outline-primary btn-sm me-1"><i class="fa-solid fa-pen-to-square"></i></button>
            <button onclick="deleteProduct('${p._id}')" class="btn btn-outline-danger btn-sm"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `).join('');
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-danger">${err.message}</td></tr>`;
  }
}

function openAddProductModal() {
  document.getElementById('product-form').reset();
  document.getElementById('pm-id').value = '';
  document.getElementById('productModalTitle').textContent = 'Add New Product';
  const modal = new bootstrap.Modal(document.getElementById('productModal'));
  modal.show();
}

function editProductModal(id) {
  const p = adminProductsList.find(item => item._id === id);
  if (!p) return;

  document.getElementById('pm-id').value = p._id;
  document.getElementById('pm-name').value = p.name;
  document.getElementById('pm-brand').value = p.brand;
  document.getElementById('pm-category').value = p.category;
  document.getElementById('pm-subcategory').value = p.subcategory || '';
  document.getElementById('pm-price').value = p.price;
  document.getElementById('pm-originalPrice').value = p.originalPrice;
  document.getElementById('pm-stock').value = p.stock;
  document.getElementById('pm-description').value = p.description;
  document.getElementById('pm-images').value = p.images.join(', ');

  document.getElementById('productModalTitle').textContent = 'Edit Product';
  const modal = new bootstrap.Modal(document.getElementById('productModal'));
  modal.show();
}

document.getElementById('product-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('pm-id').value;
  let images = document.getElementById('pm-images').value.split(',').map(s => s.trim()).filter(Boolean);

  // Handle Multer Image Upload if files selected
  const fileInput = document.getElementById('pm-file-upload');
  if (fileInput.files && fileInput.files.length > 0) {
    const formData = new FormData();
    for (let i = 0; i < fileInput.files.length; i++) {
      formData.append('images', fileInput.files[i]);
    }
    try {
      const uploadRes = await apiFetch('/upload', {
        method: 'POST',
        body: formData
      });
      if (uploadRes.success) {
        images = [...images, ...uploadRes.images];
      }
    } catch (uploadErr) {
      showToast('Image upload failed: ' + uploadErr.message, 'error');
      return;
    }
  }

  const productData = {
    name: document.getElementById('pm-name').value.trim(),
    brand: document.getElementById('pm-brand').value.trim(),
    category: document.getElementById('pm-category').value,
    subcategory: document.getElementById('pm-subcategory').value.trim(),
    price: Number(document.getElementById('pm-price').value),
    originalPrice: Number(document.getElementById('pm-originalPrice').value),
    discount: Math.round(((Number(document.getElementById('pm-originalPrice').value) - Number(document.getElementById('pm-price').value)) / Number(document.getElementById('pm-originalPrice').value)) * 100),
    stock: Number(document.getElementById('pm-stock').value),
    description: document.getElementById('pm-description').value.trim(),
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80']
  };

  try {
    if (id) {
      await apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) });
      showToast('Product updated successfully!', 'success');
    } else {
      await apiFetch('/products', { method: 'POST', body: JSON.stringify(productData) });
      showToast('Product created successfully!', 'success');
    }

    bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
    loadAdminProducts();
  } catch (err) {
    showToast(err.message, 'error');
  }
});

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  try {
    await apiFetch(`/products/${id}`, { method: 'DELETE' });
    showToast('Product deleted', 'info');
    loadAdminProducts();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// --------------------------------------------------------------------------
// 3. Admin Orders Handler
// --------------------------------------------------------------------------
let adminOrdersList = [];

async function loadAdminOrders() {
  const tbody = document.getElementById('admin-orders-tbody');
  if (!tbody) return;

  try {
    const res = await apiFetch('/admin/orders');
    if (res.success) {
      adminOrdersList = res.orders;
      tbody.innerHTML = res.orders.map(o => `
        <tr>
          <td><strong class="text-primary">${o.orderNumber}</strong></td>
          <td>${o.user ? o.user.name : 'Customer'}<br><small class="text-muted">${o.user ? o.user.email : ''}</small></td>
          <td>₹${o.totalAmount}</td>
          <td><span class="badge bg-light text-dark border">${o.paymentMethod}</span></td>
          <td><span class="badge bg-primary">${o.orderStatus}</span></td>
          <td>
            <button onclick="openOrderStatusModal('${o._id}')" class="btn btn-outline-primary btn-sm"><i class="fa-solid fa-pen me-1"></i>Status</button>
          </td>
        </tr>
      `).join('');
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-danger">${err.message}</td></tr>`;
  }
}

function openOrderStatusModal(orderId) {
  const o = adminOrdersList.find(item => item._id === orderId);
  if (!o) return;

  document.getElementById('osm-order-id').value = o._id;
  document.getElementById('osm-status').value = o.orderStatus;
  document.getElementById('osm-payment').value = o.paymentStatus;

  const modal = new bootstrap.Modal(document.getElementById('orderStatusModal'));
  modal.show();
}

document.getElementById('order-status-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('osm-order-id').value;
  const orderStatus = document.getElementById('osm-status').value;
  const paymentStatus = document.getElementById('osm-payment').value;

  try {
    await apiFetch(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ orderStatus, paymentStatus })
    });
    showToast('Order status updated!', 'success');
    bootstrap.Modal.getInstance(document.getElementById('orderStatusModal')).hide();
    loadAdminOrders();
  } catch (err) {
    showToast(err.message, 'error');
  }
});

// --------------------------------------------------------------------------
// 4. Admin Users & Role Handler
// --------------------------------------------------------------------------
async function loadAdminUsers() {
  const tbody = document.getElementById('admin-users-tbody');
  if (!tbody) return;

  try {
    const res = await apiFetch('/admin/users');
    if (res.success) {
      tbody.innerHTML = res.users.map(u => `
        <tr>
          <td class="fw-bold">${u.name}</td>
          <td><code>${u.username}</code></td>
          <td>${u.email}</td>
          <td>${u.phone || 'N/A'}</td>
          <td><span class="badge ${u.role === 'admin' ? 'bg-warning text-dark' : 'bg-secondary'}">${u.role}</span></td>
          <td>
            <button onclick="toggleUserRole('${u._id}', '${u.role}')" class="btn btn-outline-secondary btn-sm">
              Switch to ${u.role === 'admin' ? 'User' : 'Admin'}
            </button>
          </td>
        </tr>
      `).join('');
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-danger">${err.message}</td></tr>`;
  }
}

async function toggleUserRole(userId, currentRole) {
  const newRole = currentRole === 'admin' ? 'user' : 'admin';
  try {
    await apiFetch(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role: newRole })
    });
    showToast(`Role updated to ${newRole}`, 'success');
    loadAdminUsers();
  } catch (err) {
    showToast(err.message, 'error');
  }
}
