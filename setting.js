/**
 * Biblioteca para manipular Settings
 */
'use strict'

const { Gio } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function settings(key, type) {
    let settings = _getSettings();
    if (type == 'i')  return settings.get_int(key);
    if (type == 'd')  return settings.get_double(key);
    if (type == 'b')  return settings.get_boolean(key);
    if (type == 's')  return settings.get_string(key);
    if (type == 'as') return settings.get_strv(key);
    if (type == 'e')  return settings.get_enum(key);
}

function _getSettings() {
    let GioSSS = Gio.SettingsSchemaSource;
    let schemaSource = GioSSS.new_from_directory(
        Me.dir.get_child('schemas').get_path(),
        GioSSS.get_default(),
        false
    );
    let schemaObj = schemaSource.lookup(
        'org.gnome.shell.extensions.gnome-shell-extension',
        true
    );
    if (!schemaObj) {
        throw new Error(_('Não foi possível encontrar schemas'));
    }
    return new Gio.Settings({ settings_schema: schemaObj });
}
