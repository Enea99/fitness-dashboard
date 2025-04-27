document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
  
    const users = [
      { username: 'user123', password: 'pass123' },
      { username: 'admin', password: 'adminpass' }
    ];
  
    const user = users.find(u => u.username === username && u.password === password);
  
    if (user) {
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('currentUser', user.username);
      window.location.href = 'dashboard.html';
    } else {
      document.getElementById('login-error').textContent = 'Invalid username or password.';
    }
  });
  
  // Clear login error message when the user starts typing again
  document.getElementById('username').addEventListener('input', function () {
    document.getElementById('login-error').textContent = '';
  });
  document.getElementById('password').addEventListener('input', function () {
    document.getElementById('login-error').textContent = '';
  });
  