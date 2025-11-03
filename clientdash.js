// Dashboard JavaScript - Basic Working Version
class Dashboard {
    constructor() {
        this.currentScreen = 'homeScreen';
        this.selectedPackage = null;
        this.selectedMamaFua = null;
        this.userLocation = null;
        this.init();
    }

    init() {
        console.log('Dashboard initializing...');
        this.initializeEventListeners();
        this.getCurrentLocation();
        this.loadSampleData();
        console.log('Dashboard initialized successfully');
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

        // Bottom navigation
        const navItems = document.querySelectorAll('.nav-item');
        console.log('Found nav items:', navItems.length);
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const screen = e.currentTarget.getAttribute('data-screen');
                console.log('Navigation clicked:', screen);
                this.switchScreen(screen);
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // Request button
        const requestBtn = document.getElementById('requestBtn');
        if (requestBtn) {
            requestBtn.addEventListener('click', () => {
                console.log('Request button clicked');
                this.switchScreen('packageScreen');
            });
        }

        // Package selection
        const packageCards = document.querySelectorAll('.package-card');
        console.log('Found package cards:', packageCards.length);
        
        packageCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const price = e.currentTarget.getAttribute('data-price');
                const serviceType = e.currentTarget.querySelector('h3').textContent;
                console.log('Package selected:', serviceType, price);
                this.selectPackage(price, serviceType, e.currentTarget);
                this.searchMamaFua();
            });
        });

        // Back buttons
        const packageBackBtn = document.getElementById('packageBackBtn');
        const searchBackBtn = document.getElementById('searchBackBtn');
        const trackingBackBtn = document.getElementById('trackingBackBtn');
        
        if (packageBackBtn) {
            packageBackBtn.addEventListener('click', () => {
                this.switchScreen('homeScreen');
            });
        }
        
        if (searchBackBtn) {
            searchBackBtn.addEventListener('click', () => {
                this.switchScreen('packageScreen');
            });
        }
        
        if (trackingBackBtn) {
            trackingBackBtn.addEventListener('click', () => {
                this.switchScreen('homeScreen');
            });
        }

        // Request tabs
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tab);
                
                // Update active state
                tabBtns.forEach(tabBtn => tabBtn.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // Logout buttons
        const logoutBtns = document.querySelectorAll('.logout, .logout-option');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Are you sure you want to logout?')) {
                    window.location.href = 'index.html';
                }
            });
        });

        // Call and message buttons (using event delegation)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.call-btn')) {
                alert('Calling Mama Fua...');
            }
            
            if (e.target.closest('.message-btn')) {
                alert('Opening chat with Mama Fua...');
            }
        });

        console.log('All event listeners set up successfully');
    }

    toggleMenu() {
        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            navMenu.classList.toggle('active');
            console.log('Menu toggled');
        }
    }

    switchScreen(screenName) {
        console.log('Switching to screen:', screenName);
        
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
            console.log('Successfully switched to:', screenName);
        } else {
            console.error('Screen not found:', screenName);
        }
    }

    switchTab(tabName) {
        console.log('Switching to tab:', tabName);
        
        // Hide all tab contents
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(tab => {
            tab.classList.remove('active');
        });

        // Show target tab
        const targetTab = document.getElementById(tabName + 'Tab');
        if (targetTab) {
            targetTab.classList.add('active');
            console.log('Tab switched to:', tabName);
        }
    }

    getCurrentLocation() {
        console.log('Getting current location...');
        
        // For demo purposes, use a default location
        this.userLocation = { 
            lat: -1.286389, 
            lng: 36.817223,
            address: "Nairobi Central Business District"
        };
        
        const locationElement = document.getElementById('currentLocation');
        if (locationElement) {
            locationElement.textContent = this.userLocation.address;
        }
        
        console.log('Location set to:', this.userLocation.address);
    }

    selectPackage(price, serviceType, element) {
        console.log('Selecting package:', serviceType, price);
        
        // Remove active class from all packages
        const packageCards = document.querySelectorAll('.package-card');
        packageCards.forEach(card => {
            card.style.border = 'none';
            card.style.backgroundColor = 'white';
        });

        // Add active state to selected package
        element.style.border = '2px solid #007bff';
        element.style.backgroundColor = '#f8f9fa';
        this.selectedPackage = { price, serviceType };
        
        console.log('Package selected:', this.selectedPackage);
    }

    searchMamaFua() {
        console.log('Starting Mama Fua search...');
        this.switchScreen('searchScreen');

        // Simulate search delay
        setTimeout(() => {
            this.showMamaFuaResults();
        }, 2000);
    }

    showMamaFuaResults() {
        console.log('Showing Mama Fua results');
        const resultsContainer = document.getElementById('mamaFuaResults');
        if (!resultsContainer) {
            console.error('Mama Fua results container not found');
            return;
        }

        resultsContainer.innerHTML = '';

        // Sample Mama Fua data
        const mamaFuas = [
            { 
                name: "Sarah Wanjiku", 
                rating: 4.8, 
                reviews: 127, 
                distance: "0.8km", 
                price: this.selectedPackage.price,
                service: this.selectedPackage.serviceType
            },
            { 
                name: "Grace Akinyi", 
                rating: 4.9, 
                reviews: 203, 
                distance: "1.2km", 
                price: this.selectedPackage.price,
                service: this.selectedPackage.serviceType
            },
            { 
                name: "Mary Achieng", 
                rating: 4.7, 
                reviews: 89, 
                distance: "0.5km", 
                price: this.selectedPackage.price,
                service: this.selectedPackage.serviceType
            }
        ];

        mamaFuas.forEach((mamaFua) => {
            const card = document.createElement('div');
            card.className = 'mama-fua-card';
            card.innerHTML = `
                <div class="mama-fua-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="mama-fua-details">
                    <h4>${mamaFua.name}</h4>
                    <p>${mamaFua.distance} away • ${mamaFua.reviews} reviews</p>
                    <div class="mama-fua-service">
                        <i class="fas fa-hands"></i> ${mamaFua.service}
                    </div>
                    <div class="mama-fua-rating">
                        <i class="fas fa-star"></i> ${mamaFua.rating}
                    </div>
                </div>
                <div class="mama-fua-price">
                    KSh ${mamaFua.price}
                </div>
            `;

            card.addEventListener('click', () => {
                this.confirmRequest(mamaFua);
            });

            resultsContainer.appendChild(card);
        });

        // Update search status
        const searchStatus = document.querySelector('.search-status h3');
        const searchSubtitle = document.querySelector('.search-status p');
        
        if (searchStatus) searchStatus.textContent = 'Mama Fua Found!';
        if (searchSubtitle) searchSubtitle.textContent = 'Select a Mama Fua to proceed with your request';
        
        console.log('Mama Fua results displayed');
    }

    confirmRequest(mamaFua) {
        console.log('Confirming request with:', mamaFua.name);
        
        // Store selected mama fua
        this.selectedMamaFua = mamaFua;
        
        // Show location prompt
        this.showLocationPrompt();
    }

    showLocationPrompt() {
        const useCurrentLocation = confirm("Use your current location for service?\n\nClick OK to use current location\nClick Cancel to enter different location");
        
        if (useCurrentLocation) {
            console.log('Using current location');
            this.proceedWithTracking();
        } else {
            const address = prompt("Please enter your address:");
            if (address) {
                this.userLocation.address = address;
                this.proceedWithTracking();
            }
        }
    }

    proceedWithTracking() {
        console.log('Proceeding with tracking');
        
        // Add to upcoming requests
        this.addToUpcomingRequests(this.selectedMamaFua);
        
        // Show tracking screen
        this.showTrackingScreen();
    }

    showTrackingScreen() {
        console.log('Showing tracking screen');
        
        // Update mama fua info
        const nameElement = document.getElementById('trackingMamaFuaName');
        const serviceElement = document.querySelector('.vehicle-info span');
        
        if (nameElement) nameElement.textContent = this.selectedMamaFua.name;
        if (serviceElement) {
            serviceElement.textContent = `${this.selectedMamaFua.service} • KSh ${this.selectedMamaFua.price}`;
        }
        
        // Switch to tracking screen
        this.switchScreen('trackingScreen');
        
        // Start tracking simulation
        this.simulateMamaFuaTracking();
    }

    simulateMamaFuaTracking() {
        console.log('Starting Mama Fua tracking simulation');
        
        let progress = 0;
        const totalSteps = 5;
        const interval = 3000; // 3 seconds per update
        
        const updateTracking = () => {
            if (progress < totalSteps) {
                progress++;
                
                // Update ETA and distance
                const distanceElement = document.getElementById('distance');
                const etaElement = document.getElementById('eta');
                
                const remainingDistance = (totalSteps - progress) * 200;
                const remainingTime = (totalSteps - progress) * 2;
                
                if (distanceElement) distanceElement.textContent = `${remainingDistance} meters`;
                if (etaElement) etaElement.textContent = `${remainingTime} minutes`;
                
                console.log(`Tracking update: ${remainingDistance}m, ${remainingTime}min`);
                
                // Continue simulation
                setTimeout(updateTracking, interval);
            } else {
                // Arrival
                const etaElement = document.getElementById('eta');
                const distanceElement = document.getElementById('distance');
                
                if (etaElement) etaElement.textContent = 'Arriving now!';
                if (distanceElement) distanceElement.textContent = 'At your location';
                
                console.log('Mama Fua has arrived!');
                
                setTimeout(() => {
                    alert('Mama Fua has arrived! Please meet her at your location.');
                }, 1000);
            }
        };
        
        // Start simulation
        setTimeout(updateTracking, interval);
    }

    addToUpcomingRequests(mamaFua) {
        console.log('Adding to upcoming requests:', mamaFua.name);
        
        const upcomingList = document.getElementById('upcomingList');
        const emptyState = document.getElementById('upcomingEmpty');
        
        if (!upcomingList || !emptyState) {
            console.error('Upcoming requests elements not found');
            return;
        }

        // Hide empty state
        emptyState.style.display = 'none';
        upcomingList.style.display = 'block';

        const locationText = this.userLocation?.address || 'Current Location';
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
        
        const requestItem = document.createElement('div');
        requestItem.className = 'request-item';
        requestItem.innerHTML = `
            <div class="request-info">
                <h4>${mamaFua.name}</h4>
                <p>${mamaFua.service} • Today, ${timeString} • ${locationText}</p>
            </div>
            <div class="request-status status-upcoming">
                In Progress
            </div>
        `;

        upcomingList.appendChild(requestItem);
        console.log('Request added to upcoming');
    }

    loadSampleData() {
        console.log('Loading sample data...');
        
        // Sample past requests
        const pastRequests = [
            { name: "Esther Kamau", service: "Clothes Only", date: "Yesterday", amount: "1,000" },
            { name: "Lucy Wambui", service: "Utensils Only", date: "3 days ago", amount: "1,500" }
        ];

        const pastList = document.getElementById('pastList');
        const pastEmpty = document.getElementById('pastEmpty');

        if (!pastList || !pastEmpty) {
            console.error('Past requests elements not found');
            return;
        }

        if (pastRequests.length > 0) {
            pastEmpty.style.display = 'none';
            pastList.style.display = 'block';

            pastRequests.forEach(request => {
                const requestItem = document.createElement('div');
                requestItem.className = 'request-item';
                requestItem.innerHTML = `
                    <div class="request-info">
                        <h4>${request.name}</h4>
                        <p>${request.service} • ${request.date}</p>
                    </div>
                    <div class="request-status status-completed">
                        KSh ${request.amount}
                    </div>
                `;
                pastList.appendChild(requestItem);
            });
            
            console.log('Sample past requests loaded');
        }
    }
}

// Initialize dashboard when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, starting dashboard...');
    try {
        new Dashboard();
        console.log('Dashboard started successfully');
    } catch (error) {
        console.error('Error starting dashboard:', error);
    }
});