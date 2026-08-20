/* ==========================================================================
   ShopVerse - Authentication Module
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const loginAlert = document.getElementById('login-alert');
      if (loginAlert) loginAlert.classList.add('d-none');

      const loginId = document.getElementById('loginId').value.trim();
      const password = document.getElementById('password').value;

      try {
        const res = await apiFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ loginId, password })
        });

        if (res.success) {
          setSession(res.token, res.user);
          showToast('Login successful! Redirecting...', 'success');
          setTimeout(() => {
            if (res.user.role === 'admin') {
              window.location.href = '/admin/dashboard.html';
            } else {
              window.location.href = '/index.html';
            }
          }, 800);
        }
      } catch (err) {
        if (loginAlert) {
          loginAlert.textContent = err.message || 'Login failed';
          loginAlert.classList.remove('d-none');
        }
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const registerAlert = document.getElementById('register-alert');
      if (registerAlert) registerAlert.classList.add('d-none');

      const name = document.getElementById('name').value.trim();
      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (password !== confirmPassword) {
        if (registerAlert) {
          registerAlert.textContent = 'Passwords do not match!';
          registerAlert.classList.remove('d-none');
        }
        return;
      }

      try {
        const res = await apiFetch('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name, username, email, phone, password })
        });

        if (res.success) {
          setSession(res.token, res.user);
          showToast('Account created successfully! Welcome to ShopVerse.', 'success');
          setTimeout(() => {
            window.location.href = '/index.html';
          }, 1000);
        }
      } catch (err) {
        if (registerAlert) {
          registerAlert.textContent = err.message || 'Registration failed';
          registerAlert.classList.remove('d-none');
        }
      }
    });
  }
});
