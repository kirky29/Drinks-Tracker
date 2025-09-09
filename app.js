// Drink Tracker App
class DrinkTracker {
    constructor() {
        this.today = new Date().toDateString();
        this.todayLog = [];
        this.currentCategory = 'all';
        this.quickItems = this.getDefaultItems();
        this.currentViewDate = new Date();
        this.calendarMonth = new Date();
        this.allLogs = this.loadAllLogs();
        this.user = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAuth();
        this.loadTodayLog();
        this.loadQuickItems();
        this.updateQuickAddGrid();
        this.updateStats();
        this.setupDatePicker();
        this.setupIOSFeatures();
    }
    
    setupIOSFeatures() {
        // Add iOS-style pull-to-refresh
        this.setupPullToRefresh();
        
        // Add iOS-style momentum scrolling
        this.setupMomentumScrolling();
        
        // Add iOS-style touch feedback
        this.setupTouchFeedback();
    }
    
    setupPullToRefresh() {
        let startY = 0;
        let currentY = 0;
        let isRefreshing = false;
        
        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (window.scrollY === 0 && !isRefreshing) {
                currentY = e.touches[0].clientY;
                const pullDistance = currentY - startY;
                
                if (pullDistance > 0 && pullDistance < 100) {
                    // Add visual feedback for pull-to-refresh
                    const pullIndicator = document.querySelector('.pull-indicator') || this.createPullIndicator();
                    const opacity = Math.min(pullDistance / 100, 1);
                    pullIndicator.style.opacity = opacity;
                    pullIndicator.style.transform = `translateY(${pullDistance * 0.5}px)`;
                }
            }
        });
        
        document.addEventListener('touchend', (e) => {
            if (window.scrollY === 0 && !isRefreshing) {
                const pullDistance = currentY - startY;
                
                if (pullDistance > 80) {
                    this.refreshData();
                }
                
                // Reset pull indicator
                const pullIndicator = document.querySelector('.pull-indicator');
                if (pullIndicator) {
                    pullIndicator.style.opacity = '0';
                    pullIndicator.style.transform = 'translateY(0)';
                }
            }
        });
    }
    
    createPullIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'pull-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 122, 255, 0.8);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1000;
            opacity: 0;
            transition: all 0.3s ease;
        `;
        indicator.textContent = 'Pull to refresh';
        document.body.appendChild(indicator);
        return indicator;
    }
    
    async refreshData() {
        const pullIndicator = document.querySelector('.pull-indicator');
        if (pullIndicator) {
            pullIndicator.textContent = 'Refreshing...';
            pullIndicator.style.opacity = '1';
        }
        
        // Refresh data
        this.loadTodayLog();
        this.loadQuickItems();
        this.updateQuickAddGrid();
        this.updateStats();
        
        // Add haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(20);
        }
        
        setTimeout(() => {
            if (pullIndicator) {
                pullIndicator.textContent = '✓ Refreshed';
                setTimeout(() => {
                    pullIndicator.style.opacity = '0';
                }, 1000);
            }
        }, 500);
    }
    
    setupMomentumScrolling() {
        // Enable momentum scrolling on iOS
        const scrollableElements = document.querySelectorAll('.main-content, .modal-content, .manage-items');
        scrollableElements.forEach(element => {
            element.style.webkitOverflowScrolling = 'touch';
            element.style.overscrollBehavior = 'contain';
        });
    }
    
    setupTouchFeedback() {
        // Add touch feedback to all interactive elements
        const interactiveElements = document.querySelectorAll('button, .quick-item, input, select');
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.95)';
            });
            
            element.addEventListener('touchend', () => {
                element.style.transform = 'scale(1)';
            });
        });
    }

    setupEventListeners() {
        // Category tabs
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.setCategory(e.target.dataset.category);
            });
        });

        // Add button
        document.getElementById('addBtn').addEventListener('click', () => {
            this.showAddModal();
        });

        // Calendar button
        document.getElementById('calendarBtn').addEventListener('click', () => {
            this.showCalendarModal();
        });

        // Manage button
        document.getElementById('manageBtn').addEventListener('click', () => {
            this.showManageModal();
        });

        // Modal controls
        document.getElementById('closeModal').addEventListener('click', () => {
            this.hideAddModal();
        });

        document.getElementById('closeManageModal').addEventListener('click', () => {
            this.hideManageModal();
        });

        document.getElementById('closeCalendarModal').addEventListener('click', () => {
            this.hideCalendarModal();
        });

        document.getElementById('addCustomBtn').addEventListener('click', () => {
            this.addCustomItem();
        });

        // Management modal controls
        document.getElementById('addNewItemBtn').addEventListener('click', () => {
            this.hideManageModal();
            this.showAddModal();
        });

        document.getElementById('resetItemsBtn').addEventListener('click', () => {
            this.resetQuickItems();
        });

        document.getElementById('clearAllDataBtn').addEventListener('click', () => {
            this.clearAllData();
        });

        // Date picker controls
        document.getElementById('datePicker').addEventListener('change', (e) => {
            this.setViewDate(new Date(e.target.value));
        });

        document.getElementById('prevDayBtn').addEventListener('click', () => {
            this.navigateDate(-1);
        });

        document.getElementById('nextDayBtn').addEventListener('click', () => {
            this.navigateDate(1);
        });

        document.getElementById('todayBtn').addEventListener('click', () => {
            this.goToToday();
        });

        // Authentication
        document.getElementById('loginBtn').addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Login button clicked');
            this.handleLogin();
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Close modals when clicking outside
        document.getElementById('addModal').addEventListener('click', (e) => {
            if (e.target.id === 'addModal') {
                this.hideAddModal();
            }
        });

        document.getElementById('manageModal').addEventListener('click', (e) => {
            if (e.target.id === 'manageModal') {
                this.hideManageModal();
            }
        });

        // Enter key in custom input
        document.getElementById('customItemInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addCustomItem();
            }
        });
    }

    addItem(itemName, volume = 0, unit = 'ml', price = 0) {
        const now = new Date();
        const timestamp = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)); // Convert to local timezone
        
        const logEntry = {
            name: itemName,
            volume: parseFloat(volume) || 0,
            unit: unit,
            price: parseFloat(price) || 0,
            timestamp: timestamp,
            dateString: this.getDateString(timestamp),
            timeString: this.getTimeString(timestamp),
            id: Date.now() + Math.random()
        };

        this.todayLog.push(logEntry);
        this.saveTodayLog();
        this.updateLogDisplay();
        this.updateStats();
        this.showAddAnimation();
        
        console.log('Item logged:', logEntry);
    }

    addCustomItem() {
        const itemName = document.getElementById('customItemInput').value.trim();
        const volume = document.getElementById('volumeInput').value;
        const unit = document.getElementById('unitSelect').value;
        const price = document.getElementById('priceInput').value;
        const category = document.getElementById('categorySelect').value;
        
        if (itemName) {
            this.addItem(itemName, volume, unit, price);
            
            // Add to quick items if it's a new item
            this.addToQuickItems(itemName, volume, unit, price, category);
            
            this.clearCustomForm();
            this.hideAddModal();
        }
    }

    clearCustomForm() {
        document.getElementById('customItemInput').value = '';
        document.getElementById('volumeInput').value = '';
        document.getElementById('unitSelect').value = 'ml';
        document.getElementById('priceInput').value = '';
    }

    showAddModal() {
        const modal = document.getElementById('addModal');
        modal.classList.add('show');
        document.getElementById('customItemInput').focus();
    }

    hideAddModal() {
        const modal = document.getElementById('addModal');
        modal.classList.remove('show');
        this.clearCustomForm();
    }

    updateLogDisplay() {
        const logList = document.getElementById('logList');
        
        if (this.todayLog.length === 0) {
            logList.innerHTML = '<p class="empty-state">No items logged today</p>';
            return;
        }

        // Sort by timestamp (newest first)
        const sortedLog = [...this.todayLog].sort((a, b) => b.timestamp - a.timestamp);
        
        logList.innerHTML = sortedLog.map(entry => {
            // Use pre-formatted time string if available, otherwise format timestamp
            const timeStr = entry.timeString || this.getShortTimeString(entry.timestamp);
            
            const volumeStr = entry.volume > 0 ? `${entry.volume}${entry.unit}` : '';
            const priceStr = entry.price > 0 ? `£${entry.price.toFixed(2)}` : 'Free';
            
            const fullDateTime = entry.dateString ? `${entry.dateString} at ${entry.timeString}` : entry.timestamp.toLocaleString('en-GB');
            
            return `
                <div class="log-item">
                    <div class="log-item-header">
                        <span class="log-item-name">${entry.name}</span>
                        <span class="log-item-time" title="${fullDateTime}">${timeStr}</span>
                    </div>
                    <div class="log-item-details">
                        <span>${volumeStr}</span>
                        <span>${priceStr}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateStats() {
        const totalItems = this.todayLog.length;
        const uniqueItems = new Set(this.todayLog.map(entry => entry.name)).size;
        
        // Calculate total volume in ml
        const totalVolume = this.todayLog.reduce((sum, entry) => {
            let volumeInMl = entry.volume;
            // Convert to ml for consistent calculation
            switch(entry.unit) {
                case 'l': volumeInMl *= 1000; break;
                case 'oz': volumeInMl *= 29.5735; break;
                case 'cup': volumeInMl *= 236.588; break;
                case 'can': volumeInMl *= 330; break; // Standard can size
                case 'bottle': volumeInMl *= 500; break; // Standard bottle size
                case 'piece': volumeInMl = 0; break; // Pieces don't have volume
                default: break; // ml, already in ml
            }
            return sum + volumeInMl;
        }, 0);
        
        // Calculate total cost
        const totalCost = this.todayLog.reduce((sum, entry) => sum + entry.price, 0);
        
        document.getElementById('totalItems').textContent = totalItems;
        document.getElementById('totalVolume').textContent = Math.round(totalVolume);
        document.getElementById('totalCost').textContent = `£${totalCost.toFixed(2)}`;
        document.getElementById('uniqueItems').textContent = uniqueItems;
    }

    showAddAnimation() {
        // iOS-style haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(10); // Light haptic feedback
        }
        
        // iOS-style visual feedback with bounce
        const quickItems = document.querySelectorAll('.quick-item');
        quickItems.forEach(item => {
            item.style.animation = 'bounceIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => {
                item.style.animation = '';
            }, 300);
        });
        
        // Add success feedback
        this.showSuccessFeedback();
    }
    
    showSuccessFeedback() {
        // Create a temporary success indicator
        const successIndicator = document.createElement('div');
        successIndicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 20px;
            font-size: 16px;
            font-weight: 500;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        `;
        successIndicator.textContent = '✓ Added!';
        document.body.appendChild(successIndicator);
        
        setTimeout(() => {
            successIndicator.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(successIndicator);
            }, 300);
        }, 1000);
    }

    saveTodayLog() {
        try {
            localStorage.setItem('drinkTracker_' + this.today, JSON.stringify(this.todayLog));
            this.syncToFirebase();
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    loadTodayLog() {
        try {
            const saved = localStorage.getItem('drinkTracker_' + this.today);
            if (saved) {
                this.todayLog = JSON.parse(saved).map(entry => {
                    const timestamp = new Date(entry.timestamp);
                    return {
                        ...entry,
                        timestamp: timestamp,
                        // Ensure date and time strings are properly formatted
                        dateString: entry.dateString || this.getDateString(timestamp),
                        timeString: entry.timeString || this.getTimeString(timestamp)
                    };
                });
                console.log('Loaded today\'s log:', this.todayLog);
            } else {
                console.log('No saved log found for today');
            }
            this.updateLogDisplay();
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            this.todayLog = [];
        }
    }

    async syncToFirebase() {
        // Only sync if Firebase is available and user is authenticated
        if (typeof window.db === 'undefined' || !this.user) {
            console.log('Firebase not configured or user not authenticated');
            return;
        }

        try {
            // Add each log entry to Firebase
            for (const entry of this.todayLog) {
                await window.addDoc(window.collection(window.db, 'drinkLogs'), {
                    name: entry.name,
                    volume: entry.volume,
                    unit: entry.unit,
                    price: entry.price,
                    timestamp: window.Timestamp.fromDate(entry.timestamp),
                    dateString: entry.dateString,
                    timeString: entry.timeString,
                    date: this.today,
                    userId: this.getUserId()
                });
            }
            console.log('Successfully synced to Firebase');
        } catch (error) {
            console.error('Error syncing to Firebase:', error);
        }
    }

    getUserId() {
        return this.user ? this.user.uid : 'anonymous';
    }

    // Date and time formatting functions
    getDateString(timestamp) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        return timestamp.toLocaleDateString('en-GB', options);
    }

    getTimeString(timestamp) {
        const options = { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        return timestamp.toLocaleTimeString('en-GB', options);
    }

    getShortTimeString(timestamp) {
        const options = { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        };
        return timestamp.toLocaleTimeString('en-GB', options);
    }


    // New robust features
    getDefaultItems() {
        return [];
    }

    loadQuickItems() {
        const saved = localStorage.getItem('drinkTracker_quickItems');
        if (saved) {
            try {
                this.quickItems = JSON.parse(saved);
                console.log('Loaded quick items:', this.quickItems);
            } catch (error) {
                console.error('Error parsing saved quick items:', error);
                this.quickItems = [];
            }
        } else {
            console.log('No saved quick items found, starting with empty array');
            this.quickItems = [];
        }
    }

    async saveQuickItems() {
        try {
            localStorage.setItem('drinkTracker_quickItems', JSON.stringify(this.quickItems));
            console.log('Quick items saved to localStorage');
            
            // Also sync to Firestore if user is authenticated
            if (this.user) {
                await this.syncQuickItemsToFirestore();
            }
        } catch (error) {
            console.error('Error saving quick items:', error);
        }
    }

    setCategory(category) {
        this.currentCategory = category;
        
        // Update active tab
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        this.updateQuickAddGrid();
    }

    updateQuickAddGrid() {
        const grid = document.getElementById('quickAddGrid');
        const filteredItems = this.currentCategory === 'all' 
            ? this.quickItems 
            : this.quickItems.filter(item => item.category === this.currentCategory);
        
        if (filteredItems.length === 0) {
            grid.innerHTML = `
                <div class="empty-quick-add">
                    <p>No items added yet</p>
                    <p>Tap the + button to add your first item</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = filteredItems.map(item => {
            const priceStr = item.price > 0 ? `£${item.price.toFixed(2)}` : 'Free';
            return `
                <button class="quick-item" 
                        data-item="${item.name}" 
                        data-volume="${item.volume}" 
                        data-unit="${item.unit}" 
                        data-price="${item.price}">
                    ${item.emoji} ${item.name}<br>
                    <small>${item.volume}${item.unit} - ${priceStr}</small>
                </button>
            `;
        }).join('');
        
        // Re-attach event listeners
        document.querySelectorAll('.quick-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemName = e.target.dataset.item;
                const volume = e.target.dataset.volume;
                const unit = e.target.dataset.unit;
                const price = e.target.dataset.price;
                this.addItem(itemName, volume, unit, price);
            });
        });
    }

    async addToQuickItems(name, volume, unit, price, category) {
        const emoji = this.getEmojiForCategory(category);
        const newItem = { name, volume: parseFloat(volume) || 0, unit, price: parseFloat(price) || 0, category, emoji };
        
        // Check if item already exists
        const exists = this.quickItems.some(item => item.name === name);
        if (!exists) {
            this.quickItems.push(newItem);
            await this.saveQuickItems();
            this.updateQuickAddGrid();
        }
    }

    getEmojiForCategory(category) {
        const emojis = {
            'drinks': '🥤',
            'food': '🍎',
            'custom': '📝'
        };
        return emojis[category] || '📝';
    }

    showManageModal() {
        const modal = document.getElementById('manageModal');
        modal.classList.add('show');
        this.updateManageItemsList();
    }

    hideManageModal() {
        const modal = document.getElementById('manageModal');
        modal.classList.remove('show');
    }

    updateManageItemsList() {
        const list = document.getElementById('manageItemsList');
        list.innerHTML = this.quickItems.map((item, index) => {
            const priceStr = item.price > 0 ? `£${item.price.toFixed(2)}` : 'Free';
            return `
                <div class="manage-item">
                    <div class="manage-item-info">
                        <div class="manage-item-name">${item.emoji} ${item.name}</div>
                        <div class="manage-item-details">${item.volume}${item.unit} - ${priceStr} - ${item.category}</div>
                    </div>
                    <div class="manage-item-actions">
                        <button class="manage-item-btn delete" onclick="drinkTracker.removeQuickItem(${index})">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    removeQuickItem(index) {
        if (confirm('Are you sure you want to remove this item?')) {
            this.quickItems.splice(index, 1);
            this.saveQuickItems();
            this.updateQuickAddGrid();
            this.updateManageItemsList();
        }
    }

    async resetQuickItems() {
        if (confirm('Are you sure you want to clear all items? This will remove all your custom items.')) {
            this.quickItems = [];
            await this.saveQuickItems();
            this.updateQuickAddGrid();
            this.updateManageItemsList();
        }
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear ALL data? This will remove all items and logs.')) {
            // Clear all localStorage data
            localStorage.removeItem('drinkTracker_quickItems');
            localStorage.removeItem('drinkTracker_' + this.today);
            localStorage.removeItem('drinkTracker_userId');
            
            // Reset app state
            this.quickItems = [];
            this.todayLog = [];
            
            // Update UI
            this.updateQuickAddGrid();
            this.updateLogDisplay();
            this.updateStats();
            this.updateManageItemsList();
            
            console.log('All data cleared');
        }
    }

    // Calendar and Date Filtering Functions
    loadAllLogs() {
        const allLogs = {};
        const today = new Date();
        
        // Load logs for the past 30 days and next 7 days
        for (let i = -30; i <= 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateString = date.toDateString();
            
            const saved = localStorage.getItem('drinkTracker_' + dateString);
            if (saved) {
                try {
                    allLogs[dateString] = JSON.parse(saved).map(entry => ({
                        ...entry,
                        timestamp: new Date(entry.timestamp)
                    }));
                } catch (error) {
                    console.error('Error parsing log for', dateString, error);
                }
            }
        }
        
        return allLogs;
    }

    setViewDate(date) {
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        
        // Prevent setting future dates
        if (date > today) {
            return;
        }
        
        this.currentViewDate = new Date(date);
        this.updateDateDisplay();
        this.loadLogForDate(this.currentViewDate);
    }

    navigateDate(days) {
        const newDate = new Date(this.currentViewDate);
        newDate.setDate(newDate.getDate() + days);
        
        // Prevent going into the future
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        
        if (newDate > today) {
            return; // Don't navigate to future dates
        }
        
        this.setViewDate(newDate);
    }

    goToToday() {
        this.setViewDate(new Date());
    }

    setupDatePicker() {
        const datePicker = document.getElementById('datePicker');
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        
        // Set max date to today
        datePicker.max = todayString;
        datePicker.value = todayString;
    }

    updateDateDisplay() {
        const dateString = this.currentViewDate.toDateString();
        const isToday = dateString === this.today;
        
        // Update date picker
        document.getElementById('datePicker').value = this.currentViewDate.toISOString().split('T')[0];
        
        // Update date display
        const dateDisplay = document.getElementById('dateDisplay');
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const formattedDate = this.currentViewDate.toLocaleDateString('en-GB', options);
        dateDisplay.textContent = isToday ? `Today - ${formattedDate}` : formattedDate;
        
        // Update log section title
        const logTitle = document.getElementById('logSectionTitle');
        logTitle.textContent = isToday ? "Today's Log" : `${formattedDate} Log`;
    }

    loadLogForDate(date) {
        const dateString = date.toDateString();
        const saved = localStorage.getItem('drinkTracker_' + dateString);
        
        if (saved) {
            try {
                this.todayLog = JSON.parse(saved).map(entry => ({
                    ...entry,
                    timestamp: new Date(entry.timestamp)
                }));
            } catch (error) {
                console.error('Error loading log for', dateString, error);
                this.todayLog = [];
            }
        } else {
            this.todayLog = [];
        }
        
        this.updateLogDisplay();
        this.updateStats();
    }

    showCalendarModal() {
        const modal = document.getElementById('calendarModal');
        modal.classList.add('show');
        this.generateCalendar();
        this.setupCalendarEventListeners();
    }

    hideCalendarModal() {
        const modal = document.getElementById('calendarModal');
        modal.classList.remove('show');
    }

    generateCalendar() {
        const year = this.calendarMonth.getFullYear();
        const month = this.calendarMonth.getMonth();
        
        // Update month/year display
        const monthYear = document.getElementById('calendarMonthYear');
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        monthYear.textContent = `${monthNames[month]} ${year}`;
        
        // Generate calendar grid
        const grid = document.getElementById('calendarGrid');
        grid.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day calendar-day-header';
            dayHeader.textContent = day;
            grid.appendChild(dayHeader);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            grid.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            const currentDate = new Date(year, month, day);
            const dateString = currentDate.toDateString();
            const isToday = dateString === this.today;
            const hasData = this.allLogs[dateString] && this.allLogs[dateString].length > 0;
            const isSelected = dateString === this.currentViewDate.toDateString();
            const isFuture = currentDate > new Date();
            
            if (isToday) dayElement.classList.add('today');
            if (hasData) dayElement.classList.add('has-data');
            if (isSelected) dayElement.classList.add('selected');
            if (isFuture) {
                dayElement.classList.add('future-day');
                dayElement.style.cursor = 'not-allowed';
                dayElement.style.opacity = '0.5';
            }
            
            if (!isFuture) {
                dayElement.addEventListener('click', () => {
                    this.setViewDate(currentDate);
                    this.hideCalendarModal();
                });
            }
            
            grid.appendChild(dayElement);
        }
    }

    setupCalendarEventListeners() {
        document.getElementById('prevMonthBtn').addEventListener('click', () => {
            this.calendarMonth.setMonth(this.calendarMonth.getMonth() - 1);
            this.generateCalendar();
        });
        
        document.getElementById('nextMonthBtn').addEventListener('click', () => {
            this.calendarMonth.setMonth(this.calendarMonth.getMonth() + 1);
            this.generateCalendar();
        });
        
        document.getElementById('generateReportBtn').addEventListener('click', () => {
            this.generateReport();
        });
        
        // Set max date for report inputs
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('reportStartDate').max = today;
        document.getElementById('reportEndDate').max = today;
    }

    generateReport() {
        const startDate = new Date(document.getElementById('reportStartDate').value);
        const endDate = new Date(document.getElementById('reportEndDate').value);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        if (!startDate || !endDate || startDate > endDate) {
            alert('Please select valid start and end dates');
            return;
        }
        
        if (startDate > today || endDate > today) {
            alert('Cannot generate reports for future dates');
            return;
        }
        
        const reportData = this.getReportData(startDate, endDate);
        this.displayReport(reportData);
    }

    getReportData(startDate, endDate) {
        const data = {
            totalItems: 0,
            totalVolume: 0,
            totalCost: 0,
            uniqueItems: new Set(),
            dailyData: {},
            itemBreakdown: {}
        };
        
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateString = currentDate.toDateString();
            const dayLogs = this.allLogs[dateString] || [];
            
            if (dayLogs.length > 0) {
                data.dailyData[dateString] = {
                    items: dayLogs.length,
                    volume: dayLogs.reduce((sum, entry) => {
                        let volumeInMl = entry.volume;
                        switch(entry.unit) {
                            case 'l': volumeInMl *= 1000; break;
                            case 'oz': volumeInMl *= 29.5735; break;
                            case 'cup': volumeInMl *= 236.588; break;
                            case 'can': volumeInMl *= 330; break;
                            case 'bottle': volumeInMl *= 500; break;
                            default: break;
                        }
                        return sum + volumeInMl;
                    }, 0),
                    cost: dayLogs.reduce((sum, entry) => sum + entry.price, 0)
                };
                
                data.totalItems += dayLogs.length;
                data.totalVolume += data.dailyData[dateString].volume;
                data.totalCost += data.dailyData[dateString].cost;
                
                dayLogs.forEach(entry => {
                    data.uniqueItems.add(entry.name);
                    if (!data.itemBreakdown[entry.name]) {
                        data.itemBreakdown[entry.name] = { count: 0, volume: 0, cost: 0 };
                    }
                    data.itemBreakdown[entry.name].count++;
                    data.itemBreakdown[entry.name].cost += entry.price;
                });
            }
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return data;
    }

    displayReport(data) {
        const results = document.getElementById('reportResults');
        
        const daysWithData = Object.keys(data.dailyData).length;
        const avgItemsPerDay = daysWithData > 0 ? (data.totalItems / daysWithData).toFixed(1) : 0;
        const avgVolumePerDay = daysWithData > 0 ? (data.totalVolume / daysWithData).toFixed(0) : 0;
        const avgCostPerDay = daysWithData > 0 ? (data.totalCost / daysWithData).toFixed(2) : 0;
        
        results.innerHTML = `
            <div class="report-summary">
                <div class="report-stat">
                    <span class="report-stat-value">${data.totalItems}</span>
                    <span class="report-stat-label">Total Items</span>
                </div>
                <div class="report-stat">
                    <span class="report-stat-value">${Math.round(data.totalVolume)}ml</span>
                    <span class="report-stat-label">Total Volume</span>
                </div>
                <div class="report-stat">
                    <span class="report-stat-value">£${data.totalCost.toFixed(2)}</span>
                    <span class="report-stat-label">Total Cost</span>
                </div>
                <div class="report-stat">
                    <span class="report-stat-value">${data.uniqueItems.size}</span>
                    <span class="report-stat-label">Unique Items</span>
                </div>
                <div class="report-stat">
                    <span class="report-stat-value">${avgItemsPerDay}</span>
                    <span class="report-stat-label">Avg Items/Day</span>
                </div>
                <div class="report-stat">
                    <span class="report-stat-value">£${avgCostPerDay}</span>
                    <span class="report-stat-label">Avg Cost/Day</span>
                </div>
            </div>
            
            <div class="report-chart">
                <h5>Top Items</h5>
                ${this.generateItemChart(data.itemBreakdown)}
            </div>
        `;
    }

    generateItemChart(itemBreakdown) {
        const sortedItems = Object.entries(itemBreakdown)
            .sort(([,a], [,b]) => b.count - a.count)
            .slice(0, 5);
        
        const maxCount = Math.max(...sortedItems.map(([,data]) => data.count));
        
        return sortedItems.map(([name, data]) => {
            const percentage = (data.count / maxCount) * 100;
            return `
                <div class="chart-bar">
                    <div class="chart-label">${name}</div>
                    <div class="chart-bar-fill">
                        <div class="chart-bar-progress" style="width: ${percentage}%"></div>
                    </div>
                    <div class="chart-value">${data.count}</div>
                </div>
            `;
        }).join('');
    }

    // Authentication Methods
    setupAuth() {
        // Listen for authentication state changes
        window.onAuthStateChanged(window.auth, (user) => {
            this.user = user;
            if (user) {
                console.log('User signed in:', user.email);
                this.showMainApp();
                this.loadUserData();
            } else {
                console.log('User signed out');
                this.showLoginPage();
            }
        });
    }

    async handleLogin() {
        const email = document.getElementById('emailInput').value;
        const password = document.getElementById('passwordInput').value;
        const errorDiv = document.getElementById('loginError');

        console.log('Login attempt:', { email, hasPassword: !!password });
        console.log('Firebase auth available:', !!window.auth);
        console.log('Firebase signIn function available:', !!window.signInWithEmailAndPassword);

        if (!email || !password) {
            errorDiv.textContent = 'Please enter both email and password';
            return;
        }

        if (!window.auth) {
            errorDiv.textContent = 'Firebase not initialized. Please check configuration.';
            return;
        }

        try {
            console.log('Attempting to sign in...');
            await window.signInWithEmailAndPassword(window.auth, email, password);
            console.log('Login successful');
            errorDiv.textContent = '';
        } catch (error) {
            console.error('Login error:', error);
            switch (error.code) {
                case 'auth/user-not-found':
                    errorDiv.textContent = 'No account found with this email';
                    break;
                case 'auth/wrong-password':
                    errorDiv.textContent = 'Incorrect password';
                    break;
                case 'auth/invalid-email':
                    errorDiv.textContent = 'Invalid email address';
                    break;
                case 'auth/too-many-requests':
                    errorDiv.textContent = 'Too many failed attempts. Please try again later';
                    break;
                case 'auth/network-request-failed':
                    errorDiv.textContent = 'Network error. Please check your connection.';
                    break;
                default:
                    errorDiv.textContent = `Login failed: ${error.message}`;
            }
        }
    }

    async handleLogout() {
        try {
            await window.signOut(window.auth);
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    showLoginPage() {
        document.getElementById('loginPage').style.display = 'block';
        document.getElementById('mainApp').style.display = 'none';
    }

    showMainApp() {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
    }

    async loadUserData() {
        // Load user-specific data from Firestore
        await this.loadTodayLogFromFirestore();
        await this.loadQuickItemsFromFirestore();
        this.updateQuickAddGrid();
        this.updateLogDisplay();
        this.updateStats();
    }

    async loadTodayLogFromFirestore() {
        if (!window.db || !this.user) {
            this.loadTodayLog(); // Fallback to localStorage
            return;
        }

        try {
            const q = window.query(
                window.collection(window.db, 'drinkLogs'),
                window.where('userId', '==', this.getUserId()),
                window.where('date', '==', this.today)
            );
            const querySnapshot = await window.getDocs(q);
            
            this.todayLog = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                this.todayLog.push({
                    ...data,
                    timestamp: data.timestamp.toDate(),
                    id: doc.id
                });
            });
            
            // Sort by timestamp
            this.todayLog.sort((a, b) => b.timestamp - a.timestamp);
            console.log('Loaded today\'s log from Firestore:', this.todayLog.length, 'entries');
        } catch (error) {
            console.error('Error loading from Firestore:', error);
            this.loadTodayLog(); // Fallback to localStorage
        }
    }

    async loadQuickItemsFromFirestore() {
        if (!window.db || !this.user) {
            this.loadQuickItems(); // Fallback to localStorage
            return;
        }

        try {
            const q = window.query(
                window.collection(window.db, 'quickItems'),
                window.where('userId', '==', this.getUserId())
            );
            const querySnapshot = await window.getDocs(q);
            
            this.quickItems = [];
            querySnapshot.forEach((doc) => {
                this.quickItems.push(doc.data());
            });
            
            console.log('Loaded quick items from Firestore:', this.quickItems.length, 'items');
        } catch (error) {
            console.error('Error loading quick items from Firestore:', error);
            this.loadQuickItems(); // Fallback to localStorage
        }
    }

    async syncQuickItemsToFirestore() {
        if (!window.db || !this.user) {
            return;
        }

        try {
            // Clear existing quick items for this user
            const q = window.query(
                window.collection(window.db, 'quickItems'),
                window.where('userId', '==', this.getUserId())
            );
            const querySnapshot = await window.getDocs(q);
            
            // Delete existing items (in a real app, you'd batch this)
            for (const doc of querySnapshot.docs) {
                await doc.ref.delete();
            }

            // Add current quick items
            for (const item of this.quickItems) {
                await window.addDoc(window.collection(window.db, 'quickItems'), {
                    ...item,
                    userId: this.getUserId()
                });
            }
            
            console.log('Quick items synced to Firestore');
        } catch (error) {
            console.error('Error syncing quick items to Firestore:', error);
        }
    }

    getUserId() {
        return this.user ? this.user.uid : 'anonymous';
    }
}

// Initialize the app when DOM is loaded
let drinkTracker;
document.addEventListener('DOMContentLoaded', () => {
    drinkTracker = new DrinkTracker();
});

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
