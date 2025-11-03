// Mama Fua Dashboard JavaScript
class MamaFuaDashboard {
    constructor() {
        this.currentScreen = 'onlineScreen';
        this.isOnline = true;
        this.activeRequest = null;
        this.serviceTimer = null;
        this.serviceStartTime = null;
        this.userLocation = null;
        this.init();
    }

    init() {
        console.log('Mama Fua Dashboard initializing...');
        this.initializeEventListeners();
        this.getCurrentLocation();
        this.simulateRequests();
        console.log('Mama Fua Dashboard initialized successfully');
    }

    initializeEventListeners() {
        console.log('Setting up Mama Fua event listeners...');

        // Menu toggle
        document.getElementById('menuBtn').addEventListener('click', () => this.toggleMenu());
        document.getElementById('closeMenu').addEventListener('click', () => this.toggleMenu());

        // Online toggle
        document.getElementById('onlineToggle').addEventListener('change', (e) => {
            this.toggleOnlineStatus(e.target.checked);
        });

        // Bottom navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const screen = e.currentTarget.getAttribute('data-screen');
                this.switchScreen(screen);
                
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // Side menu navigation
        document.querySelectorAll('.menu-item[data-screen]').forEach(item => {
            item.addEventListener('click', (e) => {
                const screen = e.currentTarget.getAttribute('data-screen');
                this.switchScreen(screen);
                this.toggleMenu();
                
                // Update bottom nav
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                document.querySelector(`.nav-item[data-screen="${screen}"]`).classList.add('active');
            });
        });

        // Go offline button
        document.getElementById('goOfflineBtn').addEventListener('click', () => {
            this.toggleOnlineStatus(false);
            document.getElementById('onlineToggle').checked = false;
            this.toggleMenu();
            alert('You are now offline. You will not receive new requests.');
        });

        // Wallet functionality
        this.initializeWallet();

        // Quick actions
        document.getElementById('viewRequestsBtn').addEventListener('click', () => {
            this.showNextRequest();
        });

        document.getElementById('earningsBtn').addEventListener('click', () => {
            this.switchScreen('earningsScreen');
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            document.querySelector('[data-screen="earningsScreen"]').classList.add('active');
        });

        // Request actions
        document.getElementById('declineBtn').addEventListener('click', () => {
            this.declineRequest();
        });

        document.getElementById('acceptBtn').addEventListener('click', () => {
            this.acceptRequest();
        });

        // Back buttons
        document.getElementById('walletBackBtn').addEventListener('click', () => {
            this.switchScreen('onlineScreen');
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            document.querySelector('[data-screen="onlineScreen"]').classList.add('active');
        });

        document.getElementById('profileBackBtn').addEventListener('click', () => {
            this.switchScreen('onlineScreen');
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            document.querySelector('[data-screen="onlineScreen"]').classList.add('active');
        });

        document.getElementById('earningsBackBtn').addEventListener('click', () => {
            this.switchScreen('onlineScreen');
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            document.querySelector('[data-screen="onlineScreen"]').classList.add('active');
        });

        document.getElementById('requestBackBtn').addEventListener('click', () => {
            this.switchScreen('onlineScreen');
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            document.querySelector('[data-screen="onlineScreen"]').classList.add('active');
        });

        document.getElementById('onwayBackBtn').addEventListener('click', () => {
            this.switchScreen('onlineScreen');
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            document.querySelector('[data-screen="onlineScreen"]').classList.add('active');
        });

        // On the way actions
        document.getElementById('callClientBtn').addEventListener('click', () => {
            alert('Calling client...');
        });

        document.getElementById('messageClientBtn').addEventListener('click', () => {
            alert('Opening chat with client...');
        });

        document.getElementById('arrivedBtn').addEventListener('click', () => {
            this.startService();
        });

        // Service actions
        document.getElementById('pauseServiceBtn').addEventListener('click', () => {
            this.togglePauseService();
        });

        document.getElementById('completeServiceBtn').addEventListener('click', () => {
            this.completeService();
        });

        // Edit profile button
        document.getElementById('editProfileBtn').addEventListener('click', () => {
            alert('Edit profile functionality would open here');
        });

        // Notifications button
        document.getElementById('notificationsBtn').addEventListener('click', () => {
            alert('You have 3 new notifications');
        });

        // Floating request badge
        document.getElementById('floatingRequest').addEventListener('click', () => {
            this.showNextRequest();
        });

        console.log('Mama Fua event listeners set up successfully');
    }

    initializeWallet() {
        console.log('Initializing wallet functionality...');
        
        // Elements
        const amountInput = document.getElementById('amount');
        const phoneInput = document.getElementById('phoneNumber');
        const withdrawSubmitBtn = document.getElementById('withdrawSubmit');
        const withdrawalModal = document.getElementById('withdrawalModal');
        const successModal = document.getElementById('successModal');
        const confirmAmount = document.getElementById('confirmAmount');
        const confirmPhone = document.getElementById('confirmPhone');
        const confirmFee = document.getElementById('confirmFee');
        const confirmNet = document.getElementById('confirmNet');
        const successAmount = document.getElementById('successAmount');
        const closeModalBtns = document.querySelectorAll('.close-modal');
        const cancelWithdrawalBtn = document.getElementById('cancelWithdrawal');
        const confirmWithdrawalBtn = document.getElementById('confirmWithdrawal');
        const closeSuccessBtn = document.getElementById('closeSuccess');
        
        // Commission rate (2.5%)
        const COMMISSION_RATE = 0.025;
        
        // Format phone number as user types
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.substring(0, 10);
                if (value.length <= 3) {
                    value = value;
                } else if (value.length <= 6) {
                    value = value.substring(0, 3) + ' ' + value.substring(3);
                } else {
                    value = value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6);
                }
            }
            e.target.value = value;
        });
        
        // Validate amount
        amountInput.addEventListener('input', function() {
            const amount = parseFloat(amountInput.value) || 0;
            const balance = 12800; // Current balance
            
            if (amount > balance) {
                amountInput.style.borderColor = '#e74c3c';
                withdrawSubmitBtn.disabled = true;
            } else if (amount < 100) {
                amountInput.style.borderColor = '#e74c3c';
                withdrawSubmitBtn.disabled = true;
            } else {
                amountInput.style.borderColor = '#ddd';
                withdrawSubmitBtn.disabled = false;
            }
        });
        
        // Show withdrawal confirmation modal
        withdrawSubmitBtn.addEventListener('click', () => {
            const amount = parseFloat(amountInput.value);
            const phone = phoneInput.value;
            
            if (!phone || phone.replace(/\s/g, '').length !== 10) {
                alert('Please enter a valid 10-digit M-Pesa phone number');
                return;
            }
            
            if (amount < 100 || amount > 12800) {
                alert('Amount must be between KSh 100 and KSh 12,800');
                return;
            }
            
            // Calculate commission and net amount
            const commission = amount * COMMISSION_RATE;
            const netAmount = amount - commission;
            
            // Update confirmation modal
            confirmAmount.textContent = `KSh ${amount.toLocaleString()}`;
            confirmPhone.textContent = phone;
            confirmFee.textContent = `KSh ${commission.toFixed(2)}`;
            confirmNet.textContent = `KSh ${netAmount.toLocaleString()}`;
            
            // Show modal
            withdrawalModal.classList.add('active');
        });
        
        // Confirm withdrawal
        confirmWithdrawalBtn.addEventListener('click', () => {
            const amount = parseFloat(amountInput.value);
            
            // Hide confirmation modal
            withdrawalModal.classList.remove('active');
            
            // Show success modal after a short delay (simulating processing)
            setTimeout(() => {
                successAmount.textContent = `KSh ${amount.toLocaleString()}`;
                successModal.classList.add('active');
                
                // Clear form
                amountInput.value = '';
                phoneInput.value = '';
            }, 1000);
        });
        
        // Close modals
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                withdrawalModal.classList.remove('active');
                successModal.classList.remove('active');
            });
        });
        
        cancelWithdrawalBtn.addEventListener('click', () => {
            withdrawalModal.classList.remove('active');
        });
        
        closeSuccessBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
        });
        
        // Wallet action buttons
        document.getElementById('addMoneyBtn').addEventListener('click', () => {
            alert('Add money functionality would open here');
        });
        
        document.getElementById('withdrawBtn').addEventListener('click', () => {
            // Scroll to withdrawal section
            document.querySelector('.withdrawal-section').scrollIntoView({ behavior: 'smooth' });
        });
        
        document.getElementById('transactionsBtn').addEventListener('click', () => {
            // Scroll to transaction history
            document.querySelector('.transaction-history').scrollIntoView({ behavior: 'smooth' });
        });
        
        document.getElementById('helpBtn').addEventListener('click', () => {
            alert('Help and support would be shown here');
        });
        
        console.log('Wallet functionality initialized');
    }

    toggleMenu() {
        document.getElementById('sideMenu').classList.toggle('active');
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

    switchScreen(screenName) {
        console.log('Switching to screen:', screenName);
        
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        document.getElementById(screenName).classList.add('active');
        this.currentScreen = screenName;
    }

    getCurrentLocation() {
        console.log('Getting Mama Fua location...');
        
        // For demo, use default location
        this.userLocation = { 
            lat: -1.286389, 
            lng: 36.817223 
        };
        
        console.log('Mama Fua location set to:', this.userLocation);
    }

    simulateRequests() {
        // Simulate incoming requests every 30 seconds
        setInterval(() => {
            if (this.isOnline && this.currentScreen === 'onlineScreen' && !this.activeRequest) {
                this.showFloatingRequest();
            }
        }, 30000);
    }

    showFloatingRequest() {
        const floatingBadge = document.getElementById('floatingRequest');
        floatingBadge.style.display = 'flex';
        
        // Pulse animation
        floatingBadge.style.animation = 'pulse 1s infinite';
        
        console.log('New request notification shown');
    }

    showNextRequest() {
        // Sample request data
        const requests = [
            {
                clientName: "John Doe",
                rating: 4.5,
                reviews: 15,
                distance: "1.2 km away",
                serviceType: "Full House Cleaning",
                servicePrice: "2,000",
                address: "Westlands, Nairobi",
                estimatedTime: "3-4 hours"
            },
            {
                clientName: "Grace Mwangi", 
                rating: 4.8,
                reviews: 32,
                distance: "0.8 km away",
                serviceType: "Clothes Only",
                servicePrice: "1,000",
                address: "Kilimani, Nairobi",
                estimatedTime: "2-3 hours"
            }
        ];

        const request = requests[Math.floor(Math.random() * requests.length)];
        this.activeRequest = request;

        // Update UI with request details
        document.getElementById('clientName').textContent = request.clientName;
        document.getElementById('clientDistance').textContent = request.distance;
        document.getElementById('serviceType').textContent = request.serviceType;
        document.getElementById('servicePrice').textContent = `KSh ${request.servicePrice}`;
        document.getElementById('clientAddress').textContent = request.address;

        // Set service icon based on type
        const serviceIcon = document.getElementById('serviceIcon');
        if (request.serviceType.includes('Full House')) {
            serviceIcon.className = 'fas fa-home';
        } else if (request.serviceType.includes('Clothes')) {
            serviceIcon.className = 'fas fa-tshirt';
        } else if (request.serviceType.includes('Utensils')) {
            serviceIcon.className = 'fas fa-utensils';
        }

        // Hide floating badge
        document.getElementById('floatingRequest').style.display = 'none';

        // Switch to request screen
        this.switchScreen('requestScreen');

        console.log('Showing request from:', request.clientName);
    }

    declineRequest() {
        console.log('Request declined');
        this.activeRequest = null;
        this.switchScreen('onlineScreen');
        
        // Show notification
        setTimeout(() => {
            alert('Request declined. You will receive new requests shortly.');
        }, 500);
    }

    acceptRequest() {
        console.log('Request accepted');
        
        // Update on the way screen
        document.getElementById('onwayClientName').textContent = this.activeRequest.clientName;
        document.getElementById('onwayServiceType').textContent = this.activeRequest.serviceType;
        document.getElementById('onwayAddress').textContent = this.activeRequest.address;

        // Switch to on the way screen
        this.switchScreen('onwayScreen');

        // Start navigation simulation
        this.simulateNavigation();
    }

    simulateNavigation() {
        let progress = 0;
        const totalSteps = 10;
        const interval = 2000;

        const updateNavigation = () => {
            if (progress < totalSteps) {
                progress++;
                
                const remainingDistance = (totalSteps - progress) * 120;
                const remainingTime = (totalSteps - progress) * 2;
                
                document.getElementById('tripDistance').textContent = `${remainingDistance} meters`;
                document.getElementById('etaTime').textContent = `${remainingTime} min`;
                
                setTimeout(updateNavigation, interval);
            }
        };

        setTimeout(updateNavigation, interval);
    }

    startService() {
        console.log('Service started');
        
        // Update service screen
        document.getElementById('serviceClientName').textContent = this.activeRequest.clientName;
        document.getElementById('serviceServiceType').textContent = this.activeRequest.serviceType;
        document.getElementById('serviceAddress').textContent = this.activeRequest.address;

        // Mark first step as completed and activate second step
        document.querySelectorAll('.step')[1].classList.add('active');

        // Start service timer
        this.startServiceTimer();

        // Switch to service screen
        this.switchScreen('serviceScreen');
    }

    startServiceTimer() {
        this.serviceStartTime = new Date();
        this.serviceTimer = setInterval(() => {
            const now = new Date();
            const diff = Math.floor((now - this.serviceStartTime) / 1000);
            const minutes = Math.floor(diff / 60);
            const seconds = diff % 60;
            
            document.getElementById('serviceTimer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    togglePauseService() {
        const pauseBtn = document.getElementById('pauseServiceBtn');
        const icon = pauseBtn.querySelector('i');
        
        if (icon.classList.contains('fa-pause')) {
            icon.className = 'fas fa-play';
            pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume Service';
            clearInterval(this.serviceTimer);
            console.log('Service paused');
        } else {
            icon.className = 'fas fa-pause';
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Take Break';
            this.startServiceTimer();
            console.log('Service resumed');
        }
    }

    completeService() {
        console.log('Service completed');
        
        // Stop timer
        clearInterval(this.serviceTimer);
        
        // Mark all steps as completed
        document.querySelectorAll('.step').forEach(step => {
            step.classList.add('active');
        });

        // Show completion message
        setTimeout(() => {
            alert('Service completed successfully! KSh ' + 
                  this.activeRequest.servicePrice + ' has been added to your earnings.');
            
            // Reset and go back online
            this.activeRequest = null;
            this.switchScreen('onlineScreen');
        }, 1000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting Mama Fua dashboard...');
    try {
        new MamaFuaDashboard();
        console.log('Mama Fua dashboard started successfully');
    } catch (error) {
        console.error('Error starting Mama Fua dashboard:', error);
    }
});