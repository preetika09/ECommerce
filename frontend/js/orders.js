/* ==========================================================================
   ShopVerse - Orders & Order Tracking Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (!isAuthenticated()) {
    showToast('Please login to view your orders', 'info');
    setTimeout(() => window.location.href = '/login.html', 1000);
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const singleOrderId = urlParams.get('id');

  if (singleOrderId) {
    loadSingleOrderDetail(singleOrderId);
  } else {
    loadOrdersList();
  }
});

const ORDER_STAGES = ['Order Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

async function loadOrdersList() {
  const container = document.getElementById('orders-list-container');
  if (!container) return;

  try {
    const res = await apiFetch('/orders');
    if (!res.success || res.orders.length === 0) {
      container.innerHTML = `
        <div class="card border-0 shadow-sm p-5 text-center rounded-4">
          <div class="mb-3 text-muted"><i class="fa-solid fa-box-open fa-4x"></i></div>
          <h4 class="fw-bold">No Orders Placed Yet</h4>
          <p class="text-muted small">Once you buy products, your order status & tracking will appear here.</p>
          <div>
            <a href="/products.html" class="btn btn-primary btn-lg rounded-pill px-4 fw-bold mt-2">Start Shopping</a>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = res.orders.map(order => renderOrderCard(order)).join('');
  } catch (err) {
    container.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
  }
}

function renderOrderCard(order) {
  const isCancelled = order.orderStatus === 'Cancelled';
  const currentStageIndex = ORDER_STAGES.indexOf(order.orderStatus);

  const statusBadgeMap = {
    'Order Placed': 'bg-primary',
    'Confirmed': 'bg-info text-dark',
    'Packed': 'bg-warning text-dark',
    'Shipped': 'bg-primary-subtle text-primary border border-primary',
    'Out for Delivery': 'bg-warning text-dark fw-bold',
    'Delivered': 'bg-success',
    'Cancelled': 'bg-danger'
  };

  return `
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden p-4">
      
      <!-- Order Header -->
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-3 border-bottom gap-2">
        <div>
          <span class="text-muted small">ORDER ID:</span> <strong class="text-primary">${order.orderNumber}</strong>
          <span class="text-muted ms-3 small">Placed on: ${new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
        <div class="d-flex align-items-center gap-2">
          <span class="badge ${statusBadgeMap[order.orderStatus] || 'bg-secondary'} fs-6 px-3 py-2">${order.orderStatus}</span>
          <a href="/order-details.html?id=${order._id}" class="btn btn-outline-secondary btn-sm fw-semibold">View Invoice</a>
        </div>
      </div>

      <!-- Tracking Progress Bar (If not cancelled) -->
      ${!isCancelled ? `
        <div class="my-3 px-2">
          <div class="order-tracking-steps">
            ${ORDER_STAGES.map((stage, idx) => {
              const isCompleted = idx <= currentStageIndex;
              const isActive = idx === currentStageIndex;
              return `
                <div class="text-center" style="flex: 1;">
                  <div class="step-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''} mx-auto">
                    ${isCompleted ? '<i class="fa-solid fa-check"></i>' : (idx + 1)}
                  </div>
                  <div class="step-label d-none d-md-block ${isActive ? 'text-primary fw-bold' : ''}">${stage}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : `
        <div class="alert alert-danger py-2 mb-3">
          <i class="fa-solid fa-ban me-2"></i>This order was cancelled on ${new Date(order.updatedAt).toLocaleDateString()}.
        </div>
      `}

      <!-- Ordered Items Thumbnails -->
      <div class="row g-3 align-items-center my-2">
        <div class="col-md-8">
          <div class="hstack gap-3 overflow-x-auto pb-2">
            ${order.items.map(item => `
              <div class="d-flex align-items-center gap-2 bg-body-tertiary p-2 rounded-3" style="min-width: 200px;">
                <img src="${item.image || 'https://via.placeholder.com/50'}" style="width: 50px; height: 50px; object-fit: cover;" class="rounded-2">
                <div>
                  <div class="fw-bold small text-truncate" style="max-width: 130px;">${item.name}</div>
                  <div class="text-muted x-small">Qty: ${item.quantity} • ₹${item.price}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="col-md-4 text-md-end border-start-md ps-md-4">
          <div class="text-muted small">Total Amount</div>
          <div class="fw-extrabold fs-4 text-primary">₹${order.totalAmount}</div>
          <span class="badge ${order.paymentStatus === 'Completed' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-dark'} small">
            ${order.paymentMethod} • ${order.paymentStatus}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex justify-content-between align-items-center pt-3 border-top mt-3">
        <span class="text-muted small"><i class="fa-solid fa-location-dot me-1"></i>Delivering to: <strong>${order.shippingAddress.fullName}</strong> (${order.shippingAddress.pincode})</span>
        ${(!isCancelled && ['Order Placed', 'Confirmed'].includes(order.orderStatus)) ? `
          <button onclick="cancelOrder('${order._id}')" class="btn btn-outline-danger btn-sm fw-semibold">Cancel Order</button>
        ` : ''}
      </div>

    </div>
  `;
}

async function loadSingleOrderDetail(orderId) {
  const container = document.getElementById('single-order-details-container');
  if (!container) return;

  try {
    const res = await apiFetch(`/orders/${orderId}`);
    if (!res.success) throw new Error(res.message);

    const o = res.order;
    container.innerHTML = `
      <div class="card border-0 shadow-lg rounded-4 p-4 p-md-5">
        <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
          <div>
            <h3 class="fw-bold mb-1">Order Invoice</h3>
            <span class="text-muted">Order ID: <strong>${o.orderNumber}</strong></span>
          </div>
          <span class="badge bg-primary fs-6 px-3 py-2">${o.orderStatus}</span>
        </div>

        <div class="row g-4 mb-4">
          <div class="col-md-6">
            <h6 class="fw-bold mb-2">Shipping Address</h6>
            <p class="text-muted small mb-0">
              <strong>${o.shippingAddress.fullName}</strong><br>
              ${o.shippingAddress.house}, ${o.shippingAddress.street}<br>
              ${o.shippingAddress.city}, ${o.shippingAddress.state} - ${o.shippingAddress.pincode}<br>
              Phone: ${o.shippingAddress.phone}
            </p>
          </div>

          <div class="col-md-6 text-md-end">
            <h6 class="fw-bold mb-2">Payment Details</h6>
            <p class="text-muted small mb-0">
              Payment Method: <strong>${o.paymentMethod}</strong><br>
              Payment Status: <span class="badge bg-success-subtle text-success">${o.paymentStatus}</span><br>
              Delivery Speed: <strong>${o.deliveryMethod} Delivery</strong>
            </p>
          </div>
        </div>

        <div class="table-responsive mb-4">
          <table class="table table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th>Item Description</th>
                <th class="text-center">Price</th>
                <th class="text-center">Qty</th>
                <th class="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              ${o.items.map(i => `
                <tr>
                  <td>
                    <div class="d-flex align-items-center gap-3">
                      <img src="${i.image || 'https://via.placeholder.com/50'}" style="width: 50px; height: 50px; object-fit: cover;" class="rounded-2">
                      <div>
                        <div class="fw-bold">${i.name}</div>
                        <small class="text-muted">${i.selectedSize ? 'Size: ' + i.selectedSize : ''} ${i.selectedColor ? 'Color: ' + i.selectedColor : ''}</small>
                      </div>
                    </div>
                  </td>
                  <td class="text-center">₹${i.price}</td>
                  <td class="text-center">${i.quantity}</td>
                  <td class="text-end fw-bold">₹${i.price * i.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="row justify-content-end">
          <div class="col-md-5">
            <div class="vstack gap-2 small">
              <div class="d-flex justify-content-between"><span>Subtotal:</span><span>₹${o.subtotal}</span></div>
              <div class="d-flex justify-content-between"><span>Tax (5%):</span><span>₹${o.tax}</span></div>
              <div class="d-flex justify-content-between"><span>Shipping Charge:</span><span>₹${o.shippingCharge}</span></div>
              <hr class="my-1">
              <div class="d-flex justify-content-between fw-bold fs-5 text-primary"><span>Total Amount Paid:</span><span>₹${o.totalAmount}</span></div>
            </div>
          </div>
        </div>

      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
  }
}

async function cancelOrder(orderId) {
  if (!confirm('Are you sure you want to cancel this order?')) return;
  try {
    const res = await apiFetch(`/orders/${orderId}/cancel`, { method: 'PUT' });
    if (res.success) {
      showToast('Order cancelled successfully', 'info');
      loadOrdersList();
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}
