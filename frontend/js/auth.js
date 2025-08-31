document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const messageDiv = document.getElementById('message');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Simple validation
            if (password.length < 6) {
                messageDiv.textContent = 'Password must be at least 6 characters long.';
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                messageDiv.textContent = 'Please enter a valid email address.';
                return;
            }

            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password }),
                });
                const result = await response.json();
                if (response.ok) {
                    messageDiv.textContent = 'Registration successful! Please log in.';
                    // redirect to login page after a short delay
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    messageDiv.textContent = `Error: ${result.error}`;
                }
            } catch (error) {
                console.error('Registration failed:', error);
                messageDiv.textContent = 'An error occurred during registration.';
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });
                const result = await response.json();
                if (response.ok) {
                    sessionStorage.setItem('user', JSON.stringify(result.user));
                    window.location.href = 'lobby.html';
                } else {
                    messageDiv.textContent = `Error: ${result.error}`;
                }
            } catch (error) {
                console.error('Login failed:', error);
                messageDiv.textContent = 'An error occurred during login.';
            }
        });
    }
});
