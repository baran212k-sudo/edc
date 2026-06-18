// auth.js
const firebaseConfig = {
  apiKey: "AIzaSyAYfp6ot7t8f0AvmvukUDs1yZra7E-XH84",
  authDomain: "the-originals-a3bd2.firebaseapp.com",
  projectId: "the-originals-a3bd2",
  storageBucket: "the-originals-a3bd2.firebasestorage.app",
  messagingSenderId: "499389100641",
  appId: "1:499389100641:web:34d566e631e332fcae3020",
  measurementId: "G-W65SYHT9FG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('login-modal');
    const navLoginBtn = document.getElementById('nav-login-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const submitBtn = document.getElementById('submit-auth');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const errorMsg = document.getElementById('login-error');
    const successMsg = document.getElementById('login-success');
    
    // Tabs
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const modalTitle = document.getElementById('modal-title');
    
    let isRegisterMode = false;

    // Switch to Register Mode
    if (tabRegister) {
        tabRegister.addEventListener('click', () => {
            isRegisterMode = true;
            tabRegister.classList.add('active');
            tabRegister.style.borderBottomColor = 'white';
            tabRegister.style.color = 'white';
            
            tabLogin.classList.remove('active');
            tabLogin.style.borderBottomColor = 'transparent';
            tabLogin.style.color = 'var(--text-muted)';
            
            modalTitle.textContent = 'YENİ KAYIT';
            submitBtn.textContent = 'Hesap Oluştur';
            errorMsg.style.display = 'none';
            successMsg.style.display = 'none';
        });
    }

    // Switch to Login Mode
    if (tabLogin) {
        tabLogin.addEventListener('click', () => {
            isRegisterMode = false;
            tabLogin.classList.add('active');
            tabLogin.style.borderBottomColor = 'white';
            tabLogin.style.color = 'white';
            
            tabRegister.classList.remove('active');
            tabRegister.style.borderBottomColor = 'transparent';
            tabRegister.style.color = 'var(--text-muted)';
            
            modalTitle.textContent = 'ÜYE GİRİŞİ';
            submitBtn.textContent = 'Giriş Yap';
            errorMsg.style.display = 'none';
            successMsg.style.display = 'none';
        });
    }

    // Listen to Auth State
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            setLoggedInState();
            if (loginModal) loginModal.classList.remove('active');
        } else {
            // User is signed out
            setLoggedOutState();
        }
    });

    // Navigation Login/Logout Button
    if (navLoginBtn) {
        navLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (auth.currentUser) {
                // Logout
                auth.signOut().then(() => {
                    window.location.reload();
                });
            } else {
                // Show Modal
                loginModal.classList.add('active');
            }
        });
    }

    // Close Modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            loginModal.classList.remove('active');
            errorMsg.style.display = 'none';
        });
    }

    // Handle Submit
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (!email || !password) {
                showError('Lütfen e-posta ve şifrenizi girin.');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Bekleyin...';

            if (isRegisterMode) {
                // Register
                auth.createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        errorMsg.style.display = 'none';
                        successMsg.style.display = 'block';
                        setTimeout(() => {
                            loginModal.classList.remove('active');
                            resetModal();
                        }, 1500);
                    })
                    .catch((error) => {
                        handleAuthError(error.code);
                        resetModalBtn();
                    });
            } else {
                // Login
                auth.signInWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        errorMsg.style.display = 'none';
                        loginModal.classList.remove('active');
                        resetModal();
                    })
                    .catch((error) => {
                        handleAuthError(error.code);
                        resetModalBtn();
                    });
            }
        });
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
    }

    function handleAuthError(code) {
        if (code === 'auth/email-already-in-use') showError('Bu e-posta adresi zaten kullanılıyor.');
        else if (code === 'auth/weak-password') showError('Şifre en az 6 karakter olmalıdır.');
        else if (code === 'auth/invalid-email') showError('Geçersiz e-posta adresi.');
        else if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') showError('E-posta veya şifre hatalı.');
        else showError('Bir hata oluştu. Lütfen tekrar deneyin.');
    }

    function resetModalBtn() {
        submitBtn.disabled = false;
        submitBtn.textContent = isRegisterMode ? 'Hesap Oluştur' : 'Giriş Yap';
    }

    function resetModal() {
        emailInput.value = '';
        passwordInput.value = '';
        resetModalBtn();
    }

    function setLoggedInState() {
        if (navLoginBtn) {
            navLoginBtn.textContent = 'Çıkış Yap';
        }
        document.body.classList.add('unlocked');
        document.body.classList.remove('locked');
    }

    function setLoggedOutState() {
        if (navLoginBtn) {
            navLoginBtn.textContent = 'Giriş Yap';
        }
        document.body.classList.add('locked');
        document.body.classList.remove('unlocked');
    }
});
