module.exports = {
    name: 'Moonlet Wallet',
    version: '0.0.0',
    description: 'Moonlet Wallet Extension',
    permissions: [
        'storage',
        'identity',
        'https://firebasestorage.googleapis.com/*',
        'https://*.moonlet.dev/*',
        'https://*.moonlet.io/*'
    ],
    optional_permissions: ['https://*/*'],
    background: {
        scripts: ['bundle.background.js']
    },
    content_scripts: [
        {
            matches: ['https://api.moonlet.io/*'],
            run_at: 'document_start',
            js: ['bundle.providers.cs.js'],
            all_frames: true
        }
    ],
    content_security_policy: "script-src 'self'; object-src 'self';",
    icons: {
        16: 'icons/moonlet-16px.png',
        48: 'icons/moonlet-48px.png',
        128: 'icons/moonlet-128px.png'
    },
    browser_action: {
        default_popup: 'index.html'
    },
    manifest_version: 2
};
