document.addEventListener('DOMContentLoaded', () => {
    const welcomeMessage = document.getElementById('welcome-message');
    const logoutBtn = document.getElementById('logout-btn');

    const user = JSON.parse(sessionStorage.getItem('user'));
    const guest = JSON.parse(sessionStorage.getItem('guest'));

    if (user && user.username) {
        welcomeMessage.textContent = user.username;
    } else if (guest && guest.nickname) {
        welcomeMessage.textContent = guest.nickname;
    } else {
        // If no one is logged in, redirect to the start page
        window.location.href = 'index.html';
        return; // Stop script execution
    }

    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('guest');
            // Here you might also want to call a /logout endpoint on the server
            // to clear the server-side session, but for now, client-side is enough.
            window.location.href = 'index.html';
        });
    }
});
