/**
 * Exemplo de Indicador no Gnome Shell (Sys Tray)
 */
'use strict'

const { GObject, St } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const Util = imports.misc.util;
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
        let item1 = new PopupMenu.PopupMenuItem(_('Exibir Notificação'));

        // Associando um evento
        item1.connect('activate', () => {
            Main.notify(_('Olá Mundo! Tudo bem?'));
        });
        // Adicionando o item ao menu
        this.menu.addMenuItem(item1);

        // Alterar estilo do ícone
        let item2 = new PopupMenu.PopupMenuItem(_('Alterar estilo do ícone'));
        item2.connect('activate', () => {
            let style = 'icon-style';
            if (!this._icon.has_style_class_name(style)) {
                this._icon.add_style_class_name(style);
            } else {
                this._icon.remove_style_class_name(style);
            }
        });
        this.menu.addMenuItem(item2);

        // Adicionar o separadore de item
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        // Adicionar item desabilitado (item3.sensitive = false)
        let item3 = new PopupMenu.PopupMenuItem(_('Item Desabilitado'), {reactive: false});
        this.menu.addMenuItem(item3);

        // Alterando o texto do item
        let item4 = new PopupMenu.PopupMenuItem(_('Alterar o texto'));

        // Recebe o focus
        item4.connect('enter-event', () => {
            item4.label.text = _('Texto alterado');
        });

        // Perde o focus
        item4.connect('leave-event', () => {
            item4.label.text = _('Alterar o texto');
        });

        this.menu.addMenuItem(item4);

        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        // Adicionando menu (submenu)
        this.menu.addMenuItem(this._subMenu());

        // Adicionando menu com imagens
        this.menu.addMenuItem(this._subMenuImagens());
    }

    _subMenu() {
        // Submenus (Texto, permite icone)
        let item = new PopupMenu.PopupSubMenuMenuItem(_('Documentação'), false, {});
        // Adicionando submenus
        item.menu.addAction(_('Github da Extensão'), () => {
            // Execução de um comando externo
            Util.trySpawnCommandLine('xdg-open https://github.com/RasecRapsag/gnome-shell-extension-example');
        });
        item.menu.addAction(_('Documentação Gnome JS'), () => {
            Util.trySpawnCommandLine('xdg-open https://gjs-docs.gnome.org');
        });
        item.menu.addAction(_('Extensões Gnome Shell'), () => {
            Util.trySpawnCommandLine('xdg-open https://gjs.guide/extensions');
        });

        return item;
    }

    _subMenuImagens() {
        // Submenus (Texto, permite icone)
        let item = new PopupMenu.PopupSubMenuMenuItem(_('Emoticons'), true, {});
        // Ícone no menu
        item.icon.icon_name = 'emote-love-symbolic';

        let sub1 = new PopupMenu.PopupImageMenuItem(_('Macado'), 'face-monkey-symbolic');
        sub1.add_style_class_name('submenu-padding');
        sub1.connect('activate', () => {
            this._icon.set_icon_name('face-monkey-symbolic');
        });
        item.menu.addMenuItem(sub1);

        let sub2 = new PopupMenu.PopupImageMenuItem(_('Diabo'), 'face-devilish-symbolic');
        sub2.add_style_class_name('submenu-padding');
        sub2.connect('activate', () => {
            this._icon.set_icon_name('face-devilish-symbolic');
        });
        item.menu.addMenuItem(sub2);

        let sub3 = new PopupMenu.PopupImageMenuItem(_('Anjo'), 'face-angel-symbolic');
        sub3.add_style_class_name('submenu-padding');
        sub3.connect('activate', () => {
            this._icon.set_icon_name('face-angel-symbolic');
        });
        item.menu.addMenuItem(sub3);

        let sub4 = new PopupMenu.PopupImageMenuItem(_('Sorriso'), 'face-smile-symbolic');
        sub4.add_style_class_name('submenu-padding');
        sub4.connect('activate', () => {
            this._icon.set_icon_name('face-smile-symbolic');
        });
        item.menu.addMenuItem(sub4);

        let sub5 = new PopupMenu.PopupImageMenuItem(_('Triste'), 'face-sad-symbolic');
        sub5.add_style_class_name('submenu-padding');
        sub5.connect('activate', () => {
            this._icon.set_icon_name('face-sad-symbolic');
        });
        item.menu.addMenuItem(sub5);

        let sub6 = new PopupMenu.PopupImageMenuItem(_('Coração'), 'emote-love-symbolic');
        sub6.add_style_class_name('submenu-padding');
        sub6.connect('activate', () => {
            this._icon.set_icon_name('emote-love-symbolic');
        });
        item.menu.addMenuItem(sub6);

        return item;
    }
});
