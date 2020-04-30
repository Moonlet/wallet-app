module.exports = {
    name: 'Moonlet Wallet',
    version: '0.0.0',
    description: 'Moonlet Wallet Extension',
    permissions: [
        'storage',
        'identity',
        'https://api.moonlet.xyz/*',
        'https://firebasestorage.googleapis.com/*',
        'https://*.moonlet.dev/*',
        'https://*.moonlet.io/*',
        'https://us-central1-moonlet-wallet-dev.cloudfunctions.net/*'
    ],
    optional_permissions: ['https://*/*'],
    background: {
        scripts: ['bundle.background.js']
    },
    content_security_policy: "script-src 'self'; object-src 'self'",
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
