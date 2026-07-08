const loginView = document.getElementById('login-view');
const registerView = document.getElementById('register-view');
const goToRegisterBtn = document.getElementById('go-to-register');
const goToLoginBtn = document.getElementById('go-to-login');

const alertContainer = document.getElementById('alert-container');

const loginForm = document.getElementById('login-form');
const loginUsernameInput = document.getElementById('login-username');
const loginPasswordInput = document.getElementById('login-password');

const registerForm = document.getElementById('register-form');
const registerUsernameInput = document.getElementById('register-username');
const registerEmailInput = document.getElementById('register-email');
const registerPasswordInput = document.getElementById('register-password');
const registerConfirmPasswordInput = document.getElementById('register-confirm-password');

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function showAlert(message, type = 'error') {
    if (!alertContainer) return;
    alertContainer.textContent = message;
    alertContainer.className = `alert-container alert-${type}`;
}

function hideAlert() {
    if (!alertContainer) return;
    alertContainer.className = 'alert-container hidden';
}

if (goToRegisterBtn && goToLoginBtn) {
    goToRegisterBtn.addEventListener('click', () => {
        loginView.classList.add('hidden');
        registerView.classList.remove('hidden');
        loginForm.reset();
        hideAlert();
    });

    goToLoginBtn.addEventListener('click', () => {
        registerView.classList.add('hidden');
        loginView.classList.remove('hidden');
        registerForm.reset();
        hideAlert();
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert();

        const usernameVal = loginUsernameInput.value.trim();
        const passwordVal = loginPasswordInput.value.trim();

        if (!usernameVal || !passwordVal) {
            showAlert('Please enter both username/email and password.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('auth_users')) || [];
        const matchedUser = users.find(u => 
            u.username.toLowerCase() === usernameVal.toLowerCase() || 
            u.email.toLowerCase() === usernameVal.toLowerCase()
        );

        if (!matchedUser) {
            showAlert('Invalid username/email or password.');
            return;
        }

        const hashedInput = await hashPassword(passwordVal);
        if (matchedUser.passwordHash !== hashedInput) {
            showAlert('Invalid username/email or password.');
            return;
        }

        const session = {
            username: matchedUser.username,
            email: matchedUser.email,
            loggedInAt: new Date().toLocaleString()
        };
        
        localStorage.setItem('session_user', JSON.stringify(session));
        window.location.replace('dashboard.html');
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert();

        const username = registerUsernameInput.value.trim();
        const email = registerEmailInput.value.trim();
        const password = registerPasswordInput.value.trim();
        const confirmPassword = registerConfirmPasswordInput.value.trim();

        if (!username || !email || !password || !confirmPassword) {
            showAlert('All fields are required.');
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            showAlert('Please enter a valid email address.');
            return;
        }

        if (password !== confirmPassword) {
            showAlert('Passwords do not match.');
            return;
        }

        const passwordRegex = /^(?=.*[0-9]).{8,}$/;
        if (!passwordRegex.test(password)) {
            showAlert('Password must be at least 8 characters long and contain at least one number.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('auth_users')) || [];
        const isDuplicate = users.some(u => 
            u.username.toLowerCase() === username.toLowerCase() || 
            u.email.toLowerCase() === email.toLowerCase()
        );

        if (isDuplicate) {
            showAlert('Username or email is already registered.');
            return;
        }

        const hashed = await hashPassword(password);
        
        users.push({
            username: username,
            email: email,
            passwordHash: hashed
        });

        localStorage.setItem('auth_users', JSON.stringify(users));
        showAlert('Registration successful! You can now sign in.', 'success');
        
        registerForm.reset();
        
        setTimeout(() => {
            registerView.classList.add('hidden');
            loginView.classList.remove('hidden');
            loginUsernameInput.value = username;
            hideAlert();
        }, 2000);
    });
}

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    const session = JSON.parse(localStorage.getItem('session_user'));
    if (session) {
        document.getElementById('user-display-name').textContent = session.username;
        document.getElementById('session-username').textContent = session.username;
        document.getElementById('session-email').textContent = session.email;
        document.getElementById('session-time').textContent = session.loggedInAt;
        document.getElementById('profile-avatar').textContent = session.username.charAt(0).toUpperCase();
    }

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('session_user');
        window.location.replace('index.html');
    });
}
