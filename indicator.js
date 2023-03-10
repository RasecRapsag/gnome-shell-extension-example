/**
 * Exemplo de Indicador no Gnome Shell (Sys Tray)
 */
'use strict'

const { GObject, St } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
// função responsável pela tradução das strings
const _ = ExtensionUtils.gettext;

var Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, _('Meu Belo Indicador'));

        // Ícone inicial
        this._icon = new St.Icon({
            icon_name: 'face-monkey-symbolic',
            style_class: 'system-status-icon',
        });

        // Adicionando ícone ao painel
        this.add_child(this._icon);

        // Criando um item de menu
        let item = new PopupMenu.PopupMenuItem(_('Exibir Notificação'));

        // Associando um evento
        item.connect('activate', () => {
            Main.notify(_('Olá Mundo! Tudo bem?'));
        });

        // Adicionando o item ao menu
        this.menu.addMenuItem(item);
    }
});
