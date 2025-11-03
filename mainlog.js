document.addEventListener('DOMContentLoaded', function() {
    const mamaFuaBtn = document.getElementById('mamaFuaBtn');
    const clientBtn = document.getElementById('clientBtn');
    const loginForm = document.getElementById('loginForm');
    const resetForm = document.getElementById('resetForm');
    const resetLink = document.getElementById('resetLink');
    const backToLogin = document.getElementById('backToLogin');
    const formTitle = document.getElementById('formTitle');
    const userTypeButtons = document.querySelector('.user-type-buttons');
    
    // Show login form when user type is selected
    mamaFuaBtn.addEventListener('click', function() {
        formTitle.textContent = 'Login as Mama Fua';
        userTypeButtons.style.display = 'none';
        loginForm.style.display = 'block';
        resetForm.style.display = 'none';
    });
    
    clientBtn.addEventListener('click', function() {
        formTitle.textContent = 'Login as Client';
        userTypeButtons.style.display = 'none';
        loginForm.style.display = 'block';
        resetForm.style.display = 'none';
    });
    
    // Show password reset form
    resetLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.style.display = 'none';
        resetForm.style.display = 'block';
        userTypeButtons.style.display = 'none';
    });
    
    // Back to login from reset form
    backToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        resetForm.style.display = 'none';
        loginForm.style.display = 'block';
        userTypeButtons.style.display = 'none';
    });
    
    // Function to go back to user type selection (if needed)
    function backToUserSelection() {
        loginForm.style.display = 'none';
        resetForm.style.display = 'none';
        userTypeButtons.style.display = 'flex';
    }
});