app.controller('loginController', function($http, $window, $timeout, CommonsFactory) {

    var pageController = this;
    pageController.username = "";
    pageController.password = "";
    pageController.isLoading = false;
    pageController.errorMessage = "";
    pageController.rememberMe = false;

    console.log("Secure Login Controller initialized");
    
    function init() {
        console.log("Login initialization invoked");
        
        // Check if user is already logged in
        var token = localStorage.getItem('wellplanner_token');
        if (token) {
            // Verify token is still valid
            pageController.verifyToken(token);
        }
        
        // Clear any previous error messages
        pageController.errorMessage = "";
    }
    
    // Main login function
    pageController.login = function() {
        console.log("Login attempt for username:", pageController.username);
        
        // Clear previous errors
        pageController.errorMessage = "";
        
        // Validate inputs
        if (!pageController.username || !pageController.password) {
            pageController.errorMessage = "Please enter both username and password.";
            return;
        }
        
        pageController.isLoading = true;
        
        var loginData = {
            username: pageController.username.trim(),
            password: pageController.password
        };
        
        $http({
            method: 'POST',
            url: '/api/auth/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: loginData
        }).then(function successCallback(response) {
            console.log("Login successful:", response.data);
            pageController.isLoading = false;
            
            if (response.data.success && response.data.data && response.data.data.token) {
                // Store authentication data
                var token = response.data.data.token;
                var user = response.data.data.user;
                
                localStorage.setItem('wellplanner_token', token);
                localStorage.setItem('wellplanner_user', JSON.stringify(user));
                
                // Optional: Set session storage for remember me functionality
                if (pageController.rememberMe) {
                    sessionStorage.setItem('wellplanner_remember', 'true');
                }
                
                // Redirect based on user role
                pageController.redirectAfterLogin(user);
                
            } else {
                pageController.errorMessage = "Invalid response from server. Please try again.";
            }
            
        }, function errorCallback(error) {
            console.error("Login error:", error);
            pageController.isLoading = false;
            
            // Handle specific error cases
            if (error.status === 401) {
                pageController.errorMessage = "Invalid username or password. Please try again.";
            } else if (error.status === 403) {
                pageController.errorMessage = "Account is disabled. Please contact support.";
            } else if (error.status === 429) {
                pageController.errorMessage = "Too many login attempts. Please try again later.";
            } else if (error.status === 0) {
                pageController.errorMessage = "Unable to connect to server. Please check your internet connection.";
            } else {
                pageController.errorMessage = "Login failed. Please try again.";
            }
        });
    };
    
    // Verify if existing token is still valid
    pageController.verifyToken = function(token) {
        $http({
            method: 'GET',
            url: '/api/auth/profile',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
            console.log("Token is valid, user already logged in:", response.data);
            
            if (response.data.success && response.data.data) {
                // User is already logged in, redirect to dashboard
                pageController.redirectAfterLogin(response.data.data);
            }
            
        }, function errorCallback(error) {
            console.log("Token is invalid or expired, clearing storage");
            // Token is invalid, clear storage
            localStorage.removeItem('wellplanner_token');
            localStorage.removeItem('wellplanner_user');
            sessionStorage.removeItem('wellplanner_remember');
        });
    };
    
    // Redirect user after successful login based on their role
    pageController.redirectAfterLogin = function(user) {
        console.log("Redirecting user after login:", user);
        
        // Default redirect to dashboard
        var redirectUrl = "/pages/dashboard/" + (user.business_id || 1);
        
        // Check for specific role-based redirects
        if (user.is_admin) {
            console.log("Admin user detected, redirecting to admin dashboard");
            // Could redirect to admin-specific dashboard if needed
        } else if (user.is_customer) {
            console.log("Customer user detected, redirecting to client portal");
            redirectUrl = "/client-portal/dashboard";
        }
        
        // Add a small delay for better UX
        $timeout(function() {
            $window.location.href = redirectUrl;
        }, 500);
    };
    
    // Logout function (can be called from anywhere)
    pageController.logout = function() {
        console.log("Logging out user");
        
        var token = localStorage.getItem('wellplanner_token');
        
        if (token) {
            // Call logout endpoint to invalidate token on server
            $http({
                method: 'POST',
                url: '/api/auth/logout',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(function successCallback(response) {
                console.log("Server logout successful:", response.data);
            }, function errorCallback(error) {
                console.error("Server logout error:", error);
                // Continue with client-side logout even if server logout fails
            }).finally(function() {
                pageController.clearAuthData();
            });
        } else {
            pageController.clearAuthData();
        }
    };
    
    // Clear all authentication data
    pageController.clearAuthData = function() {
        localStorage.removeItem('wellplanner_token');
        localStorage.removeItem('wellplanner_user');
        sessionStorage.removeItem('wellplanner_remember');
        
        // Reset form
        pageController.username = "";
        pageController.password = "";
        pageController.errorMessage = "";
        pageController.isLoading = false;
        
        // Redirect to login page
        $window.location.href = "/pages/login";
    };
    
    // Handle Enter key press in form
    pageController.handleKeyPress = function(event) {
        if (event.keyCode === 13) { // Enter key
            pageController.login();
        }
    };
    
    // Initialize controller
    init();

});