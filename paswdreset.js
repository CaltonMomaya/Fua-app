class PasswordReset {
    constructor() {
        this.currentStep = 1;
        this.userEmail = '';
        this.verificationCode = '';
        this.countdownTimer = null;
        this.countdownTime = 60;
        
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.updateProgressBar();
    }

    initializeEventListeners() {
        // Email form submission
        document.getElementById('emailForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEmailSubmission();
        });

        // Code form submission
        document.getElementById('codeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCodeVerification();
        });

        // Password form submission
        document.getElementById('passwordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePasswordReset();
        });

        // Code input handling
        this.setupCodeInputs();

        // Password visibility toggles
        document.getElementById('toggleNewPassword').addEventListener('click', () => {
            this.togglePasswordVisibility('newPassword');
        });

        document.getElementById('toggleConfirmPassword').addEventListener('click', () => {
            this.togglePasswordVisibility('confirmPassword');
        });

        // Password strength checking
        document.getElementById('newPassword').addEventListener('input', (e) => {
            this.checkPasswordStrength(e.target.value);
        });

        // Password matching
        document.getElementById('confirmPassword').addEventListener('input', (e) => {
            this.checkPasswordMatch();
        });

        // Resend code
        document.getElementById('resendCode').addEventListener('click', (e) => {
            e.preventDefault();
            this.resendVerificationCode();
        });

        // Back to email
        document.getElementById('backToEmail').addEventListener('click', (e) => {
            e.preventDefault();
            this.goToStep(1);
        });
    }

    handleEmailSubmission() {
        const email = document.getElementById('email').value.trim();
        
        if (!this.validateEmail(email)) {
            this.showError('Please enter a valid email address');
            return;
        }

        this.showLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            this.showLoading(false);
            this.userEmail = email;
            document.getElementById('userEmail').textContent = email;
            this.goToStep(2);
            this.startCountdown();
        }, 1500);
    }

    handleCodeVerification() {
        const enteredCode = document.getElementById('verificationCode').value;
        
        if (enteredCode.length !== 6) {
            this.showError('Please enter the complete 6-digit code');
            return;
        }

        this.showLoading(true);

        // Simulate code verification
        setTimeout(() => {
            this.showLoading(false);
            
            // For demo purposes, accept any 6-digit code
            if (enteredCode.length === 6) {
                this.verificationCode = enteredCode;
                this.goToStep(3);
            } else {
                this.showError('Invalid verification code. Please try again.');
            }
        }, 1500);
    }

    handlePasswordReset() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!this.validatePassword(newPassword)) {
            this.showError('Password must be at least 8 characters long and include uppercase, lowercase, and numbers');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        this.showLoading(true);

        // Simulate password reset API call
        setTimeout(() => {
            this.showLoading(false);
            this.showSuccessMessage();
        }, 2000);
    }

    setupCodeInputs() {
        const codeInputs = document.querySelectorAll('.code-input');
        const hiddenInput = document.getElementById('verificationCode');

        codeInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                
                if (value.length === 1) {
                    e.target.classList.add('filled');
                    
                    // Move to next input
                    if (index < codeInputs.length - 1) {
                        codeInputs[index + 1].focus();
                    }
                } else if (value.length === 0) {
                    e.target.classList.remove('filled');
                }

                // Update hidden input
                this.updateHiddenCodeInput();
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && value.length === 0 && index > 0) {
                    codeInputs[index - 1].focus();
                }
            });

            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pasteData = e.clipboardData.getData('text').slice(0, 6);
                pasteData.split('').forEach((char, i) => {
                    if (codeInputs[i]) {
                        codeInputs[i].value = char;
                        codeInputs[i].classList.add('filled');
                    }
                });
                this.updateHiddenCodeInput();
                codeInputs[Math.min(pasteData.length - 1, 5)].focus();
            });
        });
    }

    updateHiddenCodeInput() {
        const codeInputs = document.querySelectorAll('.code-input');
        const code = Array.from(codeInputs).map(input => input.value).join('');
        document.getElementById('verificationCode').value = code;
    }

    togglePasswordVisibility(fieldId) {
        const field = document.getElementById(fieldId);
        const icon = document.querySelector(`#toggle${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)} i`);
        
        if (field.type === 'password') {
            field.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            field.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    checkPasswordStrength(password) {
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        let strength = 0;
        let color = '#e74c3c';
        let text = 'Weak';

        // Check password criteria
        if (password.length >= 8) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;

        // Update UI
        strengthFill.style.width = `${strength}%`;

        if (strength >= 75) {
            color = '#27ae60';
            text = 'Strong';
        } else if (strength >= 50) {
            color = '#f39c12';
            text = 'Medium';
        }

        strengthFill.style.background = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    }

    checkPasswordMatch() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const matchElement = document.getElementById('passwordMatch');

        if (confirmPassword && newPassword === confirmPassword) {
            matchElement.classList.add('show');
        } else {
            matchElement.classList.remove('show');
        }
    }

    startCountdown() {
        const countdownElement = document.getElementById('countdown');
        const resendLink = document.getElementById('resendCode');
        
        resendLink.style.display = 'none';
        countdownElement.style.display = 'block';
        this.countdownTime = 60;

        this.countdownTimer = setInterval(() => {
            this.countdownTime--;
            countdownElement.textContent = `Resend in ${this.countdownTime}s`;

            if (this.countdownTime <= 0) {
                clearInterval(this.countdownTimer);
                resendLink.style.display = 'inline';
                countdownElement.style.display = 'none';
            }
        }, 1000);
    }

    resendVerificationCode() {
        this.showLoading(true);

        // Simulate resend code API call
        setTimeout(() => {
            this.showLoading(false);
            this.showSuccess('Verification code sent successfully!');
            this.startCountdown();
        }, 1500);
    }

    goToStep(step) {
        // Hide all steps
        document.querySelectorAll('.reset-step').forEach(step => {
            step.classList.remove('active');
        });

        // Update progress steps
        document.querySelectorAll('.step').forEach(stepEl => {
            stepEl.classList.remove('active');
            if (parseInt(stepEl.dataset.step) <= step) {
                stepEl.classList.add('active');
            }
        });

        // Show current step
        document.getElementById(`step${step}`).classList.add('active');
        this.currentStep = step;
        this.updateProgressBar();
    }

    updateProgressBar() {
        const progress = ((this.currentStep - 1) / 2) * 100;
        document.querySelector('.progress-bar').style.width = `${progress}%`;
    }

    showSuccessMessage() {
        document.querySelectorAll('.reset-step').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById('successMessage').classList.add('show');
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        spinner.classList.toggle('show', show);
    }

    showError(message) {
        alert(message); // In a real app, you'd use a better notification system
    }

    showSuccess(message) {
        alert(message); // In a real app, you'd use a better notification system
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        return password.length >= 8 && 
               /[a-z]/.test(password) && 
               /[A-Z]/.test(password) && 
               /[0-9]/.test(password);
    }
}

// Initialize the password reset functionality
document.addEventListener('DOMContentLoaded', () => {
    new PasswordReset();
});