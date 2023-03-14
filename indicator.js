/**
 * Exemplo de Indicador no Gnome Shell (Sys Tray)
 */
'use strict'

const { GObject, St, Gio } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const Util = imports.misc.util;
const Mainloop = imports.mainloop;
const Me = ExtensionUtils.getCurrentExtension();
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
// Importando Libs
const S = Me.imports.setting;
const D = Me.imports.dates;
// função responsável pela tradução das strings
const _ = ExtensionUtils.gettext;

var Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, _('Meu Belo Indicador'));

        this._timeout = null;
        this._animate_icon = S.settings('icon-ani-start', 'b');
        this._animate_refresh = S.settings('icon-ani-refresh', 'i');

        // Ícone inicial
        this._icon = new St.Icon({
            icon_name: 'face-monkey-symbolic',
            style_class: 'system-status-icon',
        });

        // Adicionando ícone ao painel
        this.add_child(this._icon);

        // Gerar log ao clicar no botão (ícone)
        this.connect("button-press-event", () => {
            log(D.getNow('%Y-%m-%d %H:%M:%S') + ' - ' + _('Botão Clicado...'));
        });

        // Criando um item de menu
        let item1 = new PopupMenu.PopupMenuItem(_('Exibir Notificação'));

        // Informações do arquivo meta.json
        let extensionName = Me.metadata.name;

        // Associando um evento
        item1.connect('activate', () => {
            // Exibe notificação: ('Título', 'Mensagem')
            Main.notify(extensionName, _('Olá Mundo! Tudo bem?'));
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

        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        // Item de menu do tipo Switch (bool)
        this._menuSwitch();

        /* 
            Diretório e caminho de arquivos
        */
        this._paths();
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

    _menuSwitch() {
        let item = new PopupMenu.PopupSwitchMenuItem(
            _('Iniciar Animação'),
            this._animate_icon,
            {}
        );

        // Mudando o status (ambos são equivalentes)
        //item.setToggleState(!item5.state)
        //item.toggle();

        if (item.state) {
            item.label.text = _('Parar Animação');
            this._animateIcon();
        }

        // Verificar o switch e altera o texto
        item.connect('toggled', (item, state) => {
            item.label.text = state ? _('Parar Animação') : _('Iniciar Animação');
            if (item.state) {
                this._animateIcon();
            } else {
                this.disable();
            }

        });
        this.menu.addMenuItem(item);
    }

    _animateIcon() {
        if (this._timeout) this.disable();
        this._timeout = Mainloop.timeout_add_seconds(this._animate_refresh, () => {
            this._animateIcon();
            return true;
        });

        // Faz atualização do ícone
        this._icon.set_icon_name(this._getIcon());
    }

    _getIcon() {
        const emoticons = [
            'face-angry-symbolic', 'face-laugh-symbolic', 'face-confused-symbolic',
            'face-cool-symbolic', 'face-crying-symbolic', 'face-embarrassed-symbolic',
            'face-glasses-symbolic', 'face-kiss-symbolic', 'face-plain-symbolic',
            'face-raspberry-symbolic', 'face-shutmouth-symbolic', 'face-sick-symbolic',
            'face-smile-big-symbolic', 'face-smirk-symbolic', 'face-surprise-symbolic',
            'face-tired-symbolic', 'face-uncertain-symbolic', 'face-worried-symbolic',
            'face-yawn-symbolic', 'face-angel-symbolic', 'face-devilish-symbolic',
            'face-monkey-symbolic', 'face-sad-symbolic', 'face-smile-symbolic',
            'emote-love-symbolic'
        ];
        let num = Math.floor(Math.random() * emoticons.length);
        return emoticons[num];
    }

    _paths() {
        let extensionFolderPath = Me.path;
        log('Pasta da extensão: ' + extensionFolderPath);

        let folderExists = Me.dir.get_child('schemas').query_exists(null);
        log('Verifica se a pasta existe: ' + folderExists);

        let folderPath = Me.dir.get_child('schemas').get_path();
        log('Caminho da pasta selecionada: ' + folderPath);

        let fileExists = Me.dir.get_child('stylesheet.css').query_exists(null);
        log('Verifica se o arquivo existe: ' + fileExists);
    }

    disable() {
        Mainloop.source_remove(this._timeout);
        this._timeout = null;
    }
});
