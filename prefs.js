'use strict';

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
// Páginas de Preferências
const PrincipalPrefs = Me.imports.preferences.principalPage;
const ExtensionPrefs = Me.imports.preferences.extensionPage;

const SettingsKey = {
    ANIMATION_START: 'icon-ani-start',
    ANIMATION_REFRESH: 'icon-ani-refresh',
    NOTIFY_MESSAGE: 'notify-msg',
};

function init() {
    ExtensionUtils.initTranslations(Me.metadata['gettext-domain']);
}

function fillPreferencesWindow(window) {
    const settings = ExtensionUtils.getSettings(
        'org.gnome.shell.extensions.gnome-shell-extension'
    );

    window.add(new PrincipalPrefs.PrincipalPage(settings));
    window.add(new ExtensionPrefs.ExtensionPage(settings, SettingsKey));

    // Habilita a pesquisa de item
    window.search_enabled = true;
}
