// Mama Fua Dashboard JavaScript

// ✅ Load user from session storage
const mamaFuaData = JSON.parse(sessionStorage.getItem("fua_logged_user"));

// If not logged in, redirect to login
if (!mamaFuaData) {
    alert("Please login to access your dashboard.");
    window.location.href = "mainlog.html";
}

class MamaFuaDashboard {
    constructor() {
        this.currentScreen = 'onlineScreen';
        this.isOnline = true;
        this.activeRequest = null;
        this.serviceTimer = null;
        this.serviceStartTime = null;
        this.init();
    }

    init() {
        console.log('Mama Fua Dashboard initializing...');
        this.updateUserInfo();
        this.initializeEventListeners();
        this.loadSampleData();
        console.log('Mama Fua Dashboard initialized successfully');
    }

    updateUserInfo() {
        // ✅ Update user information throughout the dashboard
        const userName = mamaFuaData?.username || "Mama Fua";
        
        // Update sidebar profile
        const sidebarName = document.querySelector(".profile-info h3");
        if (sidebarName) sidebarName.textContent = userName;
        
        // Update profile screen
        const profileName = document.querySelector(".profile-details .detail-value");
        if (profileName) profileName.textContent = userName;
        
        // Update card holder name
        const cardHolder = document.querySelector(".card-holder div");
        if (cardHolder) cardHolder.textContent = userName.toUpperCase();
        
        console.log('User info updated:', userName);
    }

    initializeEventListeners() {
        console.log('Setting up event listeners...');

        // Menu toggle
        const menuBtn = document.getElementById('menuBtn');
        const closeBtn = document.getElementById('closeMenu');
        
        if (menuBtn) {
            menuBtn.addEventListener('click', () => this.toggleMenu());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.toggleMenu());
        }

        // Online/Offline toggle
        const onlineToggle = document.getElementById('onlineToggle');
        if (onlineToggle) {
            onlineToggle.addEventListener('change', (e) => {
                this.toggleOnlineStatus(e.target.checked);
            });
        }

        // Go Offline button
        const goOfflineBtn = document.getElementById('goOfflineBtn');
        if (goOfflineBtn) {
            goOfflineBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to go offline?')) {
                    this.goOffline();
                }
            });
        }

        // ✅ Logout functionality
        this.initializeLogoutEvents();

        // Bottom navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const screen = e.currentTarget.getAttribute('data-screen');
                this.switchScreen(screen);
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // Back buttons
        const backButtons = document.querySelectorAll('.back-btn');
        backButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchScreen('onlineScreen');
            });
        });

        // Wallet functionality
        this.initializeWalletEvents();

        // Request functionality
        this.initializeRequestEvents();

        // Simulate incoming request (for demo)
        this.simulateIncomingRequest();

        console.log('All event listeners set up successfully');
    }

    initializeLogoutEvents() {
        // ✅ Create logout button in the side menu
        const logoutButton = document.createElement('div');
        logoutButton.className = 'menu-item logout';
        logoutButton.id = 'logoutBtn';
        logoutButton.innerHTML = `
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
        `;

        // Add logout button to the menu items
        const menuItems = document.querySelector('.menu-items');
        if (menuItems) {
            menuItems.appendChild(logoutButton);
        }

        // Add event listener for logout
        logoutButton.addEventListener('click', () => {
            this.logout();
        });

        // ✅ Also add logout option to profile screen
        const profileActions = document.querySelector('.profile-actions');
        if (profileActions) {
            const logoutProfileBtn = document.createElement('button');
            logoutProfileBtn.className = 'btn btn-secondary';
            logoutProfileBtn.id = 'logoutProfileBtn';
            logoutProfileBtn.innerHTML = `
                <i class="fas fa-sign-out-alt"></i>
                Logout
            `;
            profileActions.appendChild(logoutProfileBtn);

            logoutProfileBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            // Clear session storage
            sessionStorage.removeItem("fua_logged_user");
            
            // Show logout message
            alert('Logged out successfully!');
            
            // Redirect to login page
            window.location.href = "mainlog.html";
        }
    }

    initializeWalletEvents() {
        const withdrawBtn = document.getElementById('withdrawSubmit');
        const cancelWithdrawal = document.getElementById('cancelWithdrawal');
        const confirmWithdrawal = document.getElementById('confirmWithdrawal');
        const closeSuccess = document.getElementById('closeSuccess');

        if (withdrawBtn) {
            withdrawBtn.addEventListener('click', () => {
                this.processWithdrawal();
            });
        }

        if (cancelWithdrawal) {
            cancelWithdrawal.addEventListener('click', () => {
                this.closeModal('withdrawalModal');
            });
        }

        if (confirmWithdrawal) {
            confirmWithdrawal.addEventListener('click', () => {
                this.confirmWithdrawal();
            });
        }

        if (closeSuccess) {
            closeSuccess.addEventListener('click', () => {
                this.closeModal('successModal');
            });
        }

        // Close modals when clicking X
        const closeModalButtons = document.querySelectorAll('.close-modal');
        closeModalButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    initializeRequestEvents() {
        // Accept request
        const acceptBtn = document.getElementById('acceptBtn');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                this.acceptRequest();
            });
        }

        // Decline request
        const declineBtn = document.getElementById('declineBtn');
        if (declineBtn) {
            declineBtn.addEventListener('click', () => {
                this.declineRequest();
            });
        }

        // Arrived button
        const arrivedBtn = document.getElementById('arrivedBtn');
        if (arrivedBtn) {
            arrivedBtn.addEventListener('click', () => {
                this.startService();
            });
        }

        // Complete service
        const completeBtn = document.getElementById('completeServiceBtn');
        if (completeBtn) {
            completeBtn.addEventListener('click', () => {
                this.completeService();
            });
        }

        // Call and message buttons
        const callClientBtn = document.getElementById('callClientBtn');
        const messageClientBtn = document.getElementById('messageClientBtn');

        if (callClientBtn) {
            callClientBtn.addEventListener('click', () => {
                alert('Calling client...');
            });
        }

        if (messageClientBtn) {
            messageClientBtn.addEventListener('click', () => {
                alert('Opening chat with client...');
            });
        }
    }

    toggleMenu() {
        const sideMenu = document.getElementById('sideMenu');
        if (sideMenu) {
            sideMenu.classList.toggle('active');
        }
    }

    toggleOnlineStatus(isOnline) {
        this.isOnline = isOnline;
        const statusIndicator = document.getElementById('statusIndicator');
        const statusText = document.getElementById('statusText');
        
        if (isOnline) {
            statusIndicator.className = 'status-indicator online';
            statusText.textContent = 'Online';
            console.log('Mama Fua is now online');
        } else {
            statusIndicator.className = 'status-indicator offline';
            statusText.textContent = 'Offline';
            console.log('Mama Fua is now offline');
        }
    }

    goOffline() {
        const onlineToggle = document.getElementById('onlineToggle');
        if (onlineToggle) {
            onlineToggle.checked = false;
            this.toggleOnlineStatus(false);
        }
        this.toggleMenu();
    }

    switchScreen(screenName) {
        // Hide all screens
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(screenName);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
        }
    }

    processWithdrawal() {
        const phoneNumber = document.getElementById('phoneNumber').value;
        const amount = document.getElementById('amount').value;

        if (!phoneNumber || !amount) {
            alert('Please fill in all fields');
            return;
        }

        if (phoneNumber.length !== 10) {
            alert('Please enter a valid 10-digit M-Pesa number');
            return;
        }

        const amountNum = parseInt(amount);
        if (amountNum < 100) {
            alert('Minimum withdrawal amount is KSh 100');
            return;
        }

        // Calculate fees
        const fee = amountNum * 0.025;
        const netAmount = amountNum - fee;

        // Update confirmation modal
        document.getElementById('confirmAmount').textContent = `KSh ${amountNum.toLocaleString()}`;
        document.getElementById('confirmPhone').textContent = phoneNumber;
        document.getElementById('confirmFee').textContent = `KSh ${fee.toLocaleString()}`;
        document.getElementById('confirmNet').textContent = `KSh ${netAmount.toLocaleString()}`;

        // Show confirmation modal
        this.showModal('withdrawalModal');
    }

    confirmWithdrawal() {
        const amount = document.getElementById('amount').value;
        const phoneNumber = document.getElementById('phoneNumber').value;

        // Simulate API call
        setTimeout(() => {
            this.closeModal('withdrawalModal');
            
            // Update success modal
            document.getElementById('successAmount').textContent = `KSh ${parseInt(amount).toLocaleString()}`;
            this.showModal('successModal');
            
            // Reset form
            document.getElementById('phoneNumber').value = '';
            document.getElementById('amount').value = '';
            
            // Add to transaction history
            this.addTransaction('withdrawal', parseInt(amount), phoneNumber);
            
        }, 2000);
    }

    addTransaction(type, amount, phoneNumber) {
        const transactionList = document.querySelector('.transaction-list');
        const transactionItem = document.createElement('div');
        transactionItem.className = 'transaction-item';
        
        const isWithdrawal = type === 'withdrawal';
        const transactionType = isWithdrawal ? 'M-Pesa Withdrawal' : 'Service Payment';
        const iconClass = isWithdrawal ? 'withdrawal' : 'earning';
        const amountClass = isWithdrawal ? 'negative' : 'positive';
        const amountPrefix = isWithdrawal ? '-' : '+';
        
        transactionItem.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-icon ${iconClass}">
                    <i class="fas ${isWithdrawal ? 'fa-mobile-alt' : 'fa-hand-holding-usd'}"></i>
                </div>
                <div class="transaction-details">
                    <h4>${transactionType}</h4>
                    <p>Just now</p>
                </div>
            </div>
            <div class="transaction-amount ${amountClass}">${amountPrefix} KSh ${amount.toLocaleString()}</div>
        `;

        transactionList.insertBefore(transactionItem, transactionList.firstChild);
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    simulateIncomingRequest() {
        // Simulate incoming request after 5 seconds
        setTimeout(() => {
            if (this.isOnline && !this.activeRequest) {
                this.showIncomingRequest();
            }
        }, 5000);
    }

    showIncomingRequest() {
        const floatingBadge = document.getElementById('floatingRequest');
        if (floatingBadge) {
            floatingBadge.style.display = 'flex';
            
            floatingBadge.addEventListener('click', () => {
                this.displayRequestDetails();
                floatingBadge.style.display = 'none';
            });
        }
    }

    displayRequestDetails() {
        // Sample request data
        this.activeRequest = {
            clientName: "John Doe",
            serviceType: "Full House Cleaning",
            price: "2,000",
            distance: "1.2 km",
            address: "Westlands, Nairobi",
            estimatedTime: "3-4 hours"
        };

        // Update request screen with actual data
        document.getElementById('clientName').textContent = this.activeRequest.clientName;
        document.getElementById('serviceType').textContent = this.activeRequest.serviceType;
        document.getElementById('servicePrice').textContent = `KSh ${this.activeRequest.price}`;
        document.getElementById('clientDistance').textContent = `${this.activeRequest.distance} away`;
        document.getElementById('clientAddress').textContent = this.activeRequest.address;

        // Switch to request screen
        this.switchScreen('requestScreen');
    }

    acceptRequest() {
        console.log('Request accepted');
        
        // Update onway screen with request details
        document.getElementById('onwayClientName').textContent = this.activeRequest.clientName;
        document.getElementById('onwayServiceType').textContent = this.activeRequest.serviceType;
        document.getElementById('onwayAddress').textContent = this.activeRequest.address;
        
        this.switchScreen('onwayScreen');
        
        // Start ETA simulation
        this.simulateETA();
    }

    declineRequest() {
        console.log('Request declined');
        this.activeRequest = null;
        this.switchScreen('onlineScreen');
        
        // Simulate another request after some time
        setTimeout(() => {
            this.simulateIncomingRequest();
        }, 10000);
    }

    simulateETA() {
        let timeLeft = 15; // minutes
        const etaElement = document.getElementById('etaTime');
        
        const countdown = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                if (etaElement) {
                    etaElement.textContent = `${timeLeft} min`;
                }
            } else {
                clearInterval(countdown);
                if (etaElement) {
                    etaElement.textContent = 'Arriving now';
                }
            }
        }, 1000); // Update every second (for demo)
    }

    startService() {
        // Update service screen
        document.getElementById('serviceClientName').textContent = this.activeRequest.clientName;
        document.getElementById('serviceServiceType').textContent = this.activeRequest.serviceType;
        document.getElementById('serviceAddress').textContent = this.activeRequest.address;
        
        this.switchScreen('serviceScreen');
        
        // Start service timer
        this.startServiceTimer();
        
        // Update progress step
        const serviceStep = document.getElementById('serviceStep');
        if (serviceStep) {
            serviceStep.classList.add('active');
        }
    }

    startServiceTimer() {
        this.serviceStartTime = new Date();
        this.serviceTimer = setInterval(() => {
            const now = new Date();
            const diff = now - this.serviceStartTime;
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            
            const timerElement = document.getElementById('serviceTimer');
            if (timerElement) {
                timerElement.textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    completeService() {
        // Stop timer
        if (this.serviceTimer) {
            clearInterval(this.serviceTimer);
        }
        
        // Add to earnings
        this.addTransaction('earning', 2000); // Sample amount
        
        // Show completion message
        alert('Service marked as complete! Payment of KSh 2,000 has been added to your wallet.');
        
        // Reset
        this.activeRequest = null;
        this.switchScreen('onlineScreen');
        
        // Simulate another request
        setTimeout(() => {
            this.simulateIncomingRequest();
        }, 8000);
    }

    loadSampleData() {
        // Sample data is already in HTML, this method can be expanded
        console.log('Sample data loaded');
    }
}

// Initialize dashboard when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, starting Mama Fua dashboard...');
    try {
        new MamaFuaDashboard();
        console.log('Mama Fua Dashboard started successfully');
    } catch (error) {
        console.error('Error starting Mama Fua dashboard:', error);
    }
});