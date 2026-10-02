
const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Client-side validation
    if (!email || !password) {
        message.textContent = 'Please fill in both fields.';
        return;
    }

    if (!email.includes('@')) {
        message.textContent = 'Please enter a valid email address.';
        return;
    }

    if (password.length < 8) {
        message.textContent = 'Password must be at least 8 characters.';
        return;
    }

    try {
        // Send credentials to the backend
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        message.textContent = result.message;

        if (result.success) {
            message.className = 'success';
        } else {
            message.className = 'error';
        }

    } catch (error) {
        message.textContent = 'Unable to connect to the server.';
        message.className = 'error';
    }
});
