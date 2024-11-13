// _static/password-protect.js

/*document.addEventListener('DOMContentLoaded', function() {
    var password = 'oliot'; // Set your password here
    var userPassword = prompt('Please enter the password:');
    if (userPassword !== password) {
        document.body.innerHTML = '<h1>Access Denied</h1>';
    }
});*/

// _static/password-protect.js

document.addEventListener('DOMContentLoaded', function() {
    var password = 'oliot'; // Set your password here
    var storedPassword = localStorage.getItem('password_oli');

    if (storedPassword !== password) {
        var userPassword = prompt('Please enter the password:');
        if (userPassword === password) {
            localStorage.setItem('password_oli', password);
        } else {
            document.body.innerHTML = '<h1>Access Denied</h1>';
        }
    }
});