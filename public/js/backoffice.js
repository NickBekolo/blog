const articlesDiv = document.getElementById('articles');
const errorMessage = document.getElementById('errorMessage');
const logoutBtn = document.getElementById('logoutBtn');

async function chargerMesArticles() {
    try {
        const reponse = await fetch('/api/users/me');
        if (!reponse.ok) {
            window.location.href = '/login';
            return;
        }

        const user = await reponse.json();
        const articlesReponse = await fetch('/api/articles');
        const tousLesArticles = await articlesReponse.json();
        
        const mesArticles = tousLesArticles.filter(a => a.userId === user.id);
        
        if (mesArticles.length === 0) {
            articlesDiv.innerHTML = '<p>Vous n\'avez pas encore d\'articles</p>';
            return;
        }

        articlesDiv.innerHTML = mesArticles.map(article => `
            <div class="article-card">
                <div class="article-title">
                    <a href="/article/${article.id}">${article.title}</a>
                </div>
                <div class="article-meta">
                    ${new Date(article.createdAt).toLocaleDateString('fr-FR')}
                </div>
                <div class="article-actions">
                    <a href="/page/create-article.html?id=${article.id}" class="btn btn-primary" style="font-size: 12px; padding: 8px 15px;">Modifier</a>
                    <button onclick="supprimerArticle(${article.id})" class="btn btn-danger" style="font-size: 12px; padding: 8px 15px;">Supprimer</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        errorMessage.textContent = 'Erreur au chargement';
        errorMessage.style.display = 'block';
    }
}

async function supprimerArticle(id) {
    if (confirm('Êtes-vous sûr ?')) {
        try {
            const reponse = await fetch(`/api/articles/${id}`, {
                method: 'DELETE'
            });
            
            if (reponse.ok) {
                chargerMesArticles();
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

chargerMesArticles();
