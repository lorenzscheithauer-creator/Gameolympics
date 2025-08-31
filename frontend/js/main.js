document.addEventListener('DOMContentLoaded', () => {
    const guestForm = document.getElementById('guest-form');

    if (guestForm) {
        guestForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nickname = document.getElementById('nickname').value;

            try {
                const response = await fetch('/guest-login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nickname }),
                });

                const result = await response.json();

                if (response.ok) {
                    sessionStorage.setItem('guest', JSON.stringify(result.guest));
                    window.location.href = 'lobby.html';
                } else {
                    alert(`Error: ${result.error}`);
                }
            } catch (error) {
                console.error('Guest login failed:', error);
                alert('An error occurred during guest login.');
            }
        });
    }
});
