/* ==========================================================================
   ShopVerse - Profile & Address Book Controller Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (!isAuthenticated()) {
    showToast('Please login to view your profile', 'info');
    setTimeout(() => window.location.href = '/login.html', 1000);
    return;
  }

  loadUserProfile();
});

async function loadUserProfile() {
  try {
    const res = await apiFetch('/auth/me');
    if (!res.success) throw new Error(res.message);

    const user = res.user;

    document.getElementById('profile-display-name').textContent = user.name;
    document.getElementById('profile-display-email').textContent = user.email;
    if (user.profileImage) {
      document.getElementById('profile-avatar-img').src = user.profileImage;
      document.getElementById('profileImage').value = user.profileImage;
    }

    document.getElementById('profileName').value = user.name;
    document.getElementById('profilePhone').value = user.phone || '';

    renderAddresses(user.addresses || []);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function renderAddresses(addresses) {
  const container = document.getElementById('profile-addresses-list');
  if (!container) return;

  if (addresses.length === 0) {
    container.innerHTML = `<p class="text-muted small">No saved addresses found.</p>`;
    return;
  }

  container.innerHTML = addresses.map(a => `
    <div class="card p-3 border rounded-3 bg-body-tertiary">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <h6 class="fw-bold mb-1">${a.fullName} <span class="text-muted fw-normal">(${a.phone})</span> ${a.isDefault ? '<span class="badge bg-primary ms-2">Default</span>' : ''}</h6>
          <p class="text-muted small mb-0">${a.house}, ${a.street}, ${a.city}, ${a.state} - <strong>${a.pincode}</strong></p>
        </div>
        <button onclick="deleteAddress('${a._id}')" class="btn btn-outline-danger btn-sm"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
  `).join('');
}

document.getElementById('profile-info-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('profileName').value.trim();
  const phone = document.getElementById('profilePhone').value.trim();
  const profileImage = document.getElementById('profileImage').value.trim();

  try {
    const res = await apiFetch('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, phone, profileImage })
    });

    if (res.success) {
      showToast('Profile updated successfully!', 'success');
      localStorage.setItem('shopverse_user', JSON.stringify(res.user));
      loadUserProfile();
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
});

document.getElementById('change-password-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;

  try {
    const res = await apiFetch('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    });

    if (res.success) {
      showToast('Password changed successfully!', 'success');
      document.getElementById('change-password-form').reset();
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
});

async function deleteAddress(id) {
  if (!confirm('Are you sure you want to delete this address?')) return;
  try {
    const res = await apiFetch(`/auth/address/${id}`, { method: 'DELETE' });
    if (res.success) {
      showToast('Address deleted successfully', 'info');
      renderAddresses(res.addresses);
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}
