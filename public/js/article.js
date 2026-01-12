const articleContent = document.getElementById('articleContent');
const errorMessage = document.getElementById('errorMessage');
const logoutBtn = document.getElementById('logoutBtn');
const articleId = window.location.pathname.split('/').pop();

async function chargerArticle() {
    try {
        const reponse = await fetch(`/api/articles/${articleId}`);
        if (!reponse.ok) throw new Error('Article non trouvé');
        
        const article = await reponse.json();
        
        document.getElementById('title').textContent = article.title;
        document.getElementById('meta').textContent = 
            `Par ${article.author.firstName} ${article.author.lastName} - ${new Date(article.createdAt).toLocaleDateString('fr-FR')}`;
        document.getElementById('content').textContent = article.content;
        
        verifierProprietaire(article.userId);
    } catch (error) {
        errorMessage.textContent = 'Article non trouvé';
        errorMessage.style.display = 'block';
    }
}

function verifierProprietaire(userId) {
    const token = document.cookie.split('; ').find(row => row.startsWith('accessToken'));
    
    if (token) {
        fetch('/api/users/me')
            .then(r => r.json())
            .then(user => {
                if (user.id === userId) {
                    const actions = document.getElementById('actions');
                    actions.innerHTML = `
                        <a href="/page/create-article.html?id=${articleId}" class="btn btn-primary">Modifier</a>
                        <button onclick="supprimerArticle()" class="btn btn-danger">Supprimer</button>
                    `;
                }
            });
    }
}

async function supprimerArticle() {
    if (confirm('Êtes-vous sûr ?')) {
        try {
            const reponse = await fetch(`/api/articles/${articleId}`, {
                method: 'DELETE'
            });
            
            if (reponse.ok) {
                window.location.href = '/';
            } else {
                errorMessage.textContent = 'Erreur lors de la suppression';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            errorMessage.textContent = 'Erreur serveur';
            errorMessage.style.display = 'block';
        }
    }
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        fetch('/logout').then(() => {
            window.location.href = '/';
        });
    });
}

chargerArticle();
