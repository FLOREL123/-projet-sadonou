// ============================================
// CONFIGURATION SUPABASE - Association SADONOU
// ============================================

const SUPABASE_URL = 'https://chievpzcqmmlwgkmyjki.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoaWV2cHpjcW1tbHdna215amtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4MTY1MTgsImV4cCI6MjEwNDM5MjUxOH0.fnR_mplenE9Ket783-GHiKkJay9t4d4t_WV3-hOdmxE';

// ============================================
// FONCTIONS DE BASE
// ============================================

async function supabaseRequest(endpoint, method = 'GET', body = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, options);
        
        if (!response.ok) {
            const errorData = await response.text();
            console.error('Erreur Supabase:', errorData);
            return null;
        }
        
        if (method === 'DELETE') {
            return { success: true };
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur Supabase:', error);
        return null;
    }
}

// ============================================
// FONCTIONS MEMBRES
// ============================================

async function ajouterMembre(membre) {
    const existant = await supabaseRequest(`membres?email=eq.${membre.email}`);
    if (existant && existant.length > 0) {
        return { error: 'Cet email est déjà utilisé.' };
    }
    return await supabaseRequest('membres', 'POST', membre);
}

async function getMembres() {
    return await supabaseRequest('membres?order=nom.asc');
}

async function getMembreByEmail(email) {
    return await supabaseRequest(`membres?email=eq.${email}`);
}

async function updateMembre(id, data) {
    return await supabaseRequest(`membres?id=eq.${id}`, 'PATCH', data);
}

async function deleteMembre(id) {
    return await supabaseRequest(`membres?id=eq.${id}`, 'DELETE');
}

async function syncMembre(membre) {
    const existant = await supabaseRequest(`membres?email=eq.${membre.email}`);
    if (existant && existant.length > 0) {
        return await updateMembre(existant[0].id, membre);
    } else {
        return await ajouterMembre(membre);
    }
}

// ============================================
// FONCTIONS ÉVÉNEMENTS
// ============================================

async function ajouterEvenement(event) {
    return await supabaseRequest('evenements', 'POST', event);
}

async function getEvenements() {
    return await supabaseRequest('evenements?order=date.desc');
}

async function getEvenementById(id) {
    const result = await supabaseRequest(`evenements?id=eq.${id}`);
    return result && result.length > 0 ? result[0] : null;
}

async function updateEvenement(id, data) {
    return await supabaseRequest(`evenements?id=eq.${id}`, 'PATCH', data);
}

async function deleteEvenement(id) {
    return await supabaseRequest(`evenements?id=eq.${id}`, 'DELETE');
}

// ============================================
// FONCTIONS UTILISATEURS
// ============================================

async function loginUser(email, password) {
    const users = await supabaseRequest(`utilisateurs?email=eq.${email}`);
    if (users && users.length > 0 && users[0].password === password) {
        return users[0];
    }
    return null;
}

async function registerUser(userData) {
    const existant = await supabaseRequest(`utilisateurs?email=eq.${userData.email}`);
    if (existant && existant.length > 0) {
        return { error: 'Cet email est déjà utilisé.' };
    }
    return await supabaseRequest('utilisateurs', 'POST', userData);
}

// ============================================
// FONCTIONS DE VERIFICATION
// ============================================

async function testSupabaseConnection() {
    try {
        const result = await supabaseRequest('membres?limit=1');
        console.log('✅ Connexion Supabase réussie !');
        return true;
    } catch (error) {
        console.error('❌ Erreur de connexion Supabase:', error);
        return false;
    }
}

// Exporter les fonctions
window.Supabase = {
    ajouterMembre,
    getMembres,
    getMembreByEmail,
    updateMembre,
    deleteMembre,
    syncMembre,
    ajouterEvenement,
    getEvenements,
    getEvenementById,
    updateEvenement,
    deleteEvenement,
    loginUser,
    registerUser,
    testSupabaseConnection
};

console.log('✅ Module Supabase chargé !');
