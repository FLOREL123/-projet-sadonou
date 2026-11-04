// ============================================
// API CLIENT - Association SADONOU
// ============================================

const API_CONFIG = {
    SUPABASE_URL: 'https://chievpzcqmmlwgkmyjki.supabase.co',
    ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoaWV2cHpjcW1tbHdna215amtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4MTY1MTgsImV4cCI6MjEwNDM5MjUxOH0.fnR_mplenE9Ket783-GHiKkJay9t4d4t_WV3-hOdmxE'
};

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

function getStoredSession() {
    try {
        const session = localStorage.getItem('sadonou_session');
        return session ? JSON.parse(session) : null;
    } catch (e) { return null; }
}

function getStoredUser() {
    try {
        const user = localStorage.getItem('sadonou_user');
        return user ? JSON.parse(user) : null;
    } catch (e) { return null; }
}

function saveStoredSession(session, user) {
    localStorage.setItem('sadonou_session', JSON.stringify(session));
    localStorage.setItem('sadonou_user', JSON.stringify(user));
}

function clearStoredSession() {
    localStorage.removeItem('sadonou_session');
    localStorage.removeItem('sadonou_user');
}

// ✅ NOUVEAU : Rafraîchir le token automatiquement
async function refreshSession() {
    const session = getStoredSession();
    if (!session || !session.refresh_token) return false;

    try {
        const response = await fetch(`${API_CONFIG.SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': API_CONFIG.ANON_KEY
            },
            body: JSON.stringify({ refresh_token: session.refresh_token })
        });

        const data = await response.json();

        if (response.ok) {
            const newSession = {
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                expires_at: Math.floor(Date.now() / 1000) + data.expires_in
            };
            
            const user = getStoredUser();
            saveStoredSession(newSession, user);
            return true;
        }
    } catch (e) {
        console.error("Erreur de rafraîchissement de session:", e);
    }
    return false;
}

// ============================================
// APPEL API GÉNÉRIQUE
// ============================================
async function apiCall(endpoint, method = 'GET', body = null, requireAuth = false) {
    const url = `${API_CONFIG.SUPABASE_URL}/functions/v1/${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.ANON_KEY}`,
        'apikey': API_CONFIG.ANON_KEY
    };

    if (requireAuth) {
        let session = getStoredSession();
        
        // Si le token a expiré, on le rafraîchit AVANT de faire l'appel
        if (session && session.expires_at && Date.now() / 1000 > session.expires_at) {
            await refreshSession();
            session = getStoredSession(); 
        }

        if (session && session.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
        }
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            return {
                error: data.error || 'Erreur inconnue',
                status: response.status,
                requiresAdminCode: data.requiresAdminCode || false
            };
        }
        return data;
    } catch (error) {
        console.error('Erreur API:', error);
        return { error: error.message };
    }
}

// ============================================
// AUTHENTIFICATION
// ============================================
const Auth = {
    async signup(userData) {
        const result = await apiCall('auth-signup', 'POST', userData);
        if (!result.error && result.user) {
            try {
                await Email.send({
                    to: userData.email,
                    subject: 'Bienvenue dans l\'Association SADONOU',
                    type: 'bienvenue',
                    data: {
                        nom: userData.nom,
                        prenom: userData.prenom,
                        matricule: result.user.matricule
                    }
                });
            } catch (e) {
                console.warn('Email de bienvenue non envoyé:', e);
            }
        }
        return result;
    },

    async login(email, password, adminCode = null) {
        const payload = { email, password };
        if (adminCode) payload.adminCode = adminCode;

        const result = await apiCall('auth-login', 'POST', payload);

        if (!result.error && result.session) {
            const sessionToSave = {
                access_token: result.session.access_token,
                refresh_token: result.session.refresh_token,
                expires_at: result.session.expires_at || (Math.floor(Date.now() / 1000) + 3600)
            };
            saveStoredSession(sessionToSave, result.user);
        }

        return result;
    },

    // ✅ NOUVEAU : À appeler au chargement de la page pour vérifier la session
    async initialize() {
        const session = getStoredSession();
        if (session) {
            if (session.expires_at && Date.now() / 1000 > session.expires_at) {
                const refreshed = await refreshSession();
                if (!refreshed) {
                    clearStoredSession();
                }
            }
        }
    },

    async resetPassword(email, favoriteColor, newPassword) {
        return await apiCall('auth-reset-password', 'POST', {
            email: email,
            favorite_color: favoriteColor,
            new_password: newPassword
        });
    },

    logout() {
        clearStoredSession();
        window.location.href = 'homepage_professional_tax_services.html';
    },

    getUser() { return getStoredUser(); },
    getSession() { return getStoredSession(); },
    isLoggedIn() { return getStoredUser() !== null; },

    isAdmin() {
        const user = getStoredUser();
        if (!user || !user.roles) return false;
        return user.roles.includes('admin') || user.roles.includes('super_admin');
    },

    isSuperAdmin() {
        const user = getStoredUser();
        if (!user || !user.roles) return false;
        return user.roles.includes('super_admin');
    },

    isModerator() {
        const user = getStoredUser();
        if (!user || !user.roles) return false;
        return user.roles.includes('moderator') || user.roles.includes('admin') || user.roles.includes('super_admin');
    },

    hasAdminPrivileges() {
        return this.isAdmin() || this.isSuperAdmin() || this.isModerator();
    }
};

// ============================================
// AUTRES MODULES
// ============================================
const Membres = {
    async list(statut = null) {
        let endpoint = 'membres';
        if (statut) endpoint += `?statut=${statut}`;
        return await apiCall(endpoint, 'GET');
    },
    async create(membreData) { return await apiCall('membres', 'POST', membreData, true); },
    async update(id, updates) { return await apiCall('membres', 'PATCH', { id, ...updates }, true); },
    async delete(id) { return await apiCall(`membres?id=${id}`, 'DELETE', null, true); }
};

const Evenements = {
    async list(statut = 'publie') { return await apiCall(`evenements?statut=${statut}`, 'GET'); },
    async create(eventData) { return await apiCall('evenements', 'POST', eventData, true); },
    async update(id, updates) { return await apiCall('evenements', 'PATCH', { id, ...updates }, true); },
    async delete(id) { return await apiCall(`evenements?id=${id}`, 'DELETE', null, true); }
};

const Email = {
    async send(emailData) { return await apiCall('send-email', 'POST', emailData); }
};

const Admin = {
    async nommerAdmin(email) {
        const session = getStoredSession();
        if (!session || !session.access_token) {
            return { error: 'Session expirée. Reconnectez-vous.' };
        }
        const url = `${API_CONFIG.SUPABASE_URL}/functions/v1/auth-admin`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                    'apikey': API_CONFIG.ANON_KEY
                },
                body: JSON.stringify({ target_email: email })
            });
            const data = await response.json();
            if (!response.ok) return { error: data.error || 'Erreur lors de la nomination', status: response.status };
            return data;
        } catch (error) {
            console.error('Erreur Admin.nommerAdmin:', error);
            return { error: error.message };
        }
    }
};

window.API = { Auth, Membres, Evenements, Email, Admin, config: API_CONFIG };
console.log('✅ Module API SADONOU chargé');