const path = require('path');
const fs = require('fs');

async function exchange() {
    // 1. Tomar el token de los argumentos o del env
    const userToken = process.argv[2];
    
    if (!userToken) {
        console.error('Uso: node scripts/exchange-fb.js <USER_ACCESS_TOKEN>');
        process.exit(1);
    }

    try {
        console.log('--- Buscando Páginas Vinculadas ---');
        const res = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${userToken}`);
        const data = await res.json();

        if (data.error) {
            console.error('Error de Facebook:', data.error.message);
            return;
        }

        if (data.data && data.data.length > 0) {
            console.log('¡Éxito! Copia estos valores a tu .env.local:\n');
            data.data.forEach(page => {
                console.log(`Página: ${page.name}`);
                console.log(`FB_PAGE_ID=${page.id}`);
                console.log(`FB_PAGE_ACCESS_TOKEN=${page.access_token}`);
                console.log('-----------------------------------\n');
            });
        } else {
            console.log('No se encontraron páginas. Asegúrate de que el token tenga el permiso "pages_show_list" y "pages_manage_posts".');
        }
    } catch (e) {
        console.error('Error de red:', e.message);
    }
}

exchange();
