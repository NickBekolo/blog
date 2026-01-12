const articleForm = document.getElementById('articleForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const pageTitle = document.getElementById('pageTitle');
const submitBtn = document.getElementById('submitBtn');
const logoutBtn = document.getElementById('logoutBtn');

const params = new URLSearchParams(window.location.search);
const articleId = params.get('id');

if (articleId) {
    pageTitle.textContent = 'Modifier l\'article';
    submitBtn.textContent = 'Mettre à jour';
    chargerArticle();
}

async function chargerArticle() {
    try {
        const reponse = await fetch(`/api/articles/${articleId}`);
        const article = await reponse.json();
        
        document.getElementById('title').value = article.title;
        document.getElementById('content').value = article.content;
    } catch (error) {
        errorMessage.textContent = 'Erreur au chargement de l\'article';
        errorMessage.style.display = 'block';
    }
}

articleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    const methode = articleId ? 'PUT' : 'POST';
    const url = articleId ? `/api/articles/${articleId}` : '/api/articles';

    try {
        const reponse = await fetch(url, {
            method: methode,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        });

        if (reponse.ok) {
            successMessage.textContent = articleId ? 'Article mis à jour' : 'Article créé';
            successMessage.style.display = 'block';
            
            setTimeout(() => {
                window.location.href = '/page/backoffice.html';
            }, 1500);
        } else {
            const erreur = await reponse.json();
            errorMessage.textContent = erreur.message || 'Erreur';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        errorMessage.textContent = 'Erreur serveur';
        errorMessage.style.display = 'block';
    }
});

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        fetch('/logout').then(() => {
            window.location.href = '/';
        });
    });
}
