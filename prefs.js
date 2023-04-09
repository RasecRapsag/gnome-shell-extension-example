'use strict';

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
// Páginas de Preferências
const PrincipalPrefs = Me.imports.preferences.principalPage;

function init() {
    ExtensionUtils.initTranslations(Me.metadata['gettext-domain']);
}

function fillPreferencesWindow(window) {
    const settings = ExtensionUtils.getSettings(
        'org.gnome.shell.extensions.gnome-shell-extension'
    );

    const principalPage = new PrincipalPrefs.PrincipalPage(settings);
    window.add(principalPage);

    // Habilita a pesquisa de item
    window.search_enabled = true;
}
