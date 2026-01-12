const articlesDiv = document.getElementById('articles');
const backofficeLink = document.getElementById('backofficeLink');
const userInfo = document.getElementById('userInfo');
const loginLink = document.getElementById('loginLink');
const logoutBtn = document.getElementById('logoutBtn');

async function chargerArticles() {
    try {
        const reponse = await fetch('/api/articles');
        const articles = await reponse.json();
        
        if (articles.length === 0) {
            articlesDiv.innerHTML = '<p>Aucun article pour le moment</p>';
            return;
        }

        articlesDiv.innerHTML = articles.map(article => `
            <div class="article-card">
                <div class="article-title">
                    <a href="/article/${article.id}">${article.title}</a>
                </div>
                <div class="article-meta">
                    Par ${article.author.firstName} ${article.author.lastName} - 
                    ${new Date(article.createdAt).toLocaleDateString('fr-FR')}
                </div>
                <div class="article-content">
                    ${article.content.substring(0, 200)}...
                </div>
                <a href="/article/${article.id}" style="color: black; text-decoration: underline;">Lire la suite</a>
            </div>
        `).join('');
    } catch (error) {
        articlesDiv.innerHTML = '<p style="color: red;">Erreur au chargement des articles</p>';
    }
}

function verifierAuth() {
    const token = document.cookie.split('; ').find(row => row.startsWith('accessToken'));
    
    if (token) {
        fetch('/api/users/me')
            .then(r => r.json())
            .then(user => {
                userInfo.textContent = `Connecté: ${user.firstName}`;
                userInfo.classList.remove('hidden');
                loginLink.classList.add('hidden');
                logoutBtn.classList.remove('hidden');
                backofficeLink.classList.remove('hidden');
            });
    }
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        fetch('/logout').then(() => {
            window.location.href = '/';
        });
    });
}

verifierAuth();
chargerArticles();
