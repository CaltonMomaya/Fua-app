// Mama Fua Dashboard - FIXED VERSION
console.log('✅ mamafuadash.js is loading!');

// Check if Firebase is available
console.log('Firebase available:', typeof firebase !== 'undefined');
if (typeof firebase !== 'undefined') {
    console.log('Firebase apps:', firebase.apps);
}

// Check session storage
const mamaFuaData = JSON.parse(sessionStorage.getItem("fua_logged_user"));
console.log('User data from session storage:', mamaFuaData);

if (!mamaFuaData) {
    alert("Please login to access your dashboard.");
    window.location.href = "mainlog.html";
}

class MamaFuaDashboard {
    constructor() {
        console.log('🚀 Dashboard constructor called');
        this.currentScreen = 'onlineScreen';
        this.isOnline = true;
        this.init();
    }

    init() {
        console.log('🔧 Initializing dashboard...');
        this.updateUserInfo(); // ADDED THIS LINE - Update user info first!
        this.initializeEventListeners();
        console.log('✅ Dashboard initialized');
    }

    // ADDED THIS METHOD - Update user information throughout the dashboard
    updateUserInfo() {
        console.log('👤 Updating user info...');
        
        // Get the username from session storage - try different possible fields
        const userName = mamaFuaData?.username || mamaFuaData?.name || "Mama Fua";
        console.log('Display name:', userName);
        
        // Update sidebar profile name
        const sidebarName = document.querySelector(".profile-info h3");
        if (sidebarName) {
            sidebarName.textContent = userName;
            console.log('✅ Sidebar name updated:', userName);
        } else {
            console.log('❌ Sidebar name element not found');
        }
        
        // Update profile screen name
        const profileName = document.querySelector(".profile-details .detail-value");
        if (profileName) {
            profileName.textContent = userName;
            console.log('✅ Profile name updated:', userName);
        }
        
        // Update card holder name
        const cardHolder = document.querySelector(".card-holder div");
        if (cardHolder) {
            cardHolder.textContent = userName.toUpperCase();
            console.log('✅ Card holder updated:', userName.toUpperCase());
        }
        
        // Update phone number if available
        const userPhone = mamaFuaData?.phone || "";
        const phoneElement = document.querySelector(".profile-details .detail-value:nth-child(2)");
        if (phoneElement && userPhone) {
            phoneElement.textContent = userPhone;
            console.log('✅ Phone number updated:', userPhone);
        }
    }

    initializeEventListeners() {
        console.log('🔗 Setting up event listeners...');
        
        // Test basic button
        const menuBtn = document.getElementById('menuBtn');
        console.log('Menu button found:', menuBtn);
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                console.log('🎯 Menu button clicked!');
                this.toggleMenu();
            });
        }

        // Online toggle
        const onlineToggle = document.getElementById('onlineToggle');
        console.log('Online toggle found:', onlineToggle);
        if (onlineToggle) {
            onlineToggle.addEventListener('change', (e) => {
                console.log('🎯 Online toggle changed:', e.target.checked);
                this.toggleOnlineStatus(e.target.checked);
            });
        }

        // Bottom navigation
        const navItems = document.querySelectorAll('.nav-item');
        console.log('Nav items found:', navItems.length);
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const screen = e.currentTarget.getAttribute('data-screen');
                console.log('🎯 Navigation clicked:', screen);
                this.switchScreen(screen);
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // Back buttons
        const backButtons = document.querySelectorAll('.back-btn');
        console.log('Back buttons found:', backButtons.length);
        backButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('🎯 Back button clicked');
                this.switchScreen('onlineScreen');
            });
        });

        // Logout functionality
        this.initializeLogoutEvents();

        console.log('✅ All event listeners set up');
    }

    // ADDED THIS METHOD - Handle logout
    initializeLogoutEvents() {
        const logoutBtn = document.getElementById('logoutBtn');
        console.log('Logout button found:', logoutBtn);
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                console.log('🎯 Logout button clicked');
                this.logout();
            });
        }
    }

    // ADDED THIS METHOD - Handle logout
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            // Set offline status when logging out
            this.saveOnlineStatusToFirestore(false);
            
            // Clear session storage
            sessionStorage.removeItem("fua_logged_user");
            
            // Show logout message
            alert('Logged out successfully!');
            
            // Redirect to login page
            window.location.href = "mainlog.html";
        }
    }

    toggleMenu() {
        console.log('📱 Toggling menu');
        const sideMenu = document.getElementById('sideMenu');
        if (sideMenu) {
            sideMenu.classList.toggle('active');
            console.log('Menu toggled, active:', sideMenu.classList.contains('active'));
        }
    }

    toggleOnlineStatus(isOnline) {
        console.log('🌐 Toggling online status to:', isOnline);
        this.isOnline = isOnline;
        
        // Update UI
        const statusIndicator = document.getElementById('statusIndicator');
        const statusText = document.getElementById('statusText');
        
        if (isOnline) {
            if (statusIndicator) {
                statusIndicator.className = 'status-indicator online';
                console.log('✅ Status indicator set to online');
            }
            if (statusText) {
                statusText.textContent = 'Online';
                console.log('✅ Status text set to Online');
            }
        } else {
            if (statusIndicator) {
                statusIndicator.className = 'status-indicator offline';
                console.log('✅ Status indicator set to offline');
            }
            if (statusText) {
                statusText.textContent = 'Offline';
                console.log('✅ Status text set to Offline');
            }
        }
        
        // Try to save to Firebase (but don't block if it fails)
        this.saveOnlineStatusToFirestore(isOnline);
    }

    async saveOnlineStatusToFirestore(isOnline) {
        try {
            console.log('🔥 Attempting to save to Firestore...');
            
            if (typeof firebase === 'undefined') {
                console.log('❌ Firebase not loaded');
                return;
            }

            const db = firebase.firestore();
            console.log('✅ Firestore instance created');
            
            // Find user by email
            const snapshot = await db.collection('users')
                .where('email', '==', mamaFuaData.email)
                .limit(1)
                .get();
            
            console.log('✅ User query completed, found:', !snapshot.empty);
            
            if (!snapshot.empty) {
                snapshot.forEach(async (doc) => {
                    await db.collection('users').doc(doc.id).update({
                        isOnline: isOnline,
                        lastOnlineUpdate: new Date()
                    });
                    console.log('✅ Online status saved to Firestore for user:', doc.id);
                });
            } else {
                console.log('❌ No user found with email:', mamaFuaData.email);
            }
        } catch (error) {
            console.error('❌ Error saving to Firestore:', error);
        }
    }

    switchScreen(screenName) {
        console.log('🔄 Switching to screen:', screenName);
        
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
            console.log('✅ Screen switched to:', screenName);
        } else {
            console.log('❌ Screen not found:', screenName);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 DOM fully loaded, starting dashboard...');
    window.mamaFuaDashboard = new MamaFuaDashboard();
});