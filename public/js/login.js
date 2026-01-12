const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const reponse = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (reponse.ok) {
            window.location.href = '/';
        } else {
            const erreur = await reponse.json();
            errorMessage.textContent = erreur.message || 'Email ou mot de passe incorrect';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        errorMessage.textContent = 'Erreur serveur';
        errorMessage.style.display = 'block';
    }
});
