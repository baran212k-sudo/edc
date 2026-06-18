// auth.js
document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('login-modal');
    const navLoginBtn = document.getElementById('nav-login-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const submitBtn = document.getElementById('submit-login');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('originals_auth') === 'true';
    
    if (isLoggedIn) {
        setLoggedInState();
    }

    // Modal Triggers
    if (navLoginBtn) {
        navLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn) {
                // Logout logic
                localStorage.removeItem('originals_auth');
                window.location.reload();
            } else {
                loginModal.classList.add('active');
            }
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            loginModal.classList.remove('active');
        });
    }

    // Handle Login Submit
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (email.length > 3 && password.length >= 4) {
                // Mock Authentication Success
                localStorage.setItem('originals_auth', 'true');
                loginModal.classList.remove('active');
                setLoggedInState();
                
                // If on course page, unlock content
                if (document.body.classList.contains('locked')) {
                    document.body.classList.remove('locked');
                    document.body.classList.add('unlocked');
                }
            } else {
                document.getElementById('login-error').style.display = 'block';
            }
        });
    }

    function setLoggedInState() {
        if (navLoginBtn) {
            navLoginBtn.textContent = 'Çıkış Yap';
        }
        document.body.classList.add('unlocked');
        document.body.classList.remove('locked');
    }
});
