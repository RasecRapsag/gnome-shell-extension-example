'use strict';

const { Adw, Gtk, GObject } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Gettext = imports.gettext.domain(Me.metadata['gettext-domain']);
const _ = Gettext.gettext;

var ExtensionPage = GObject.registerClass(
class ExtensionPage extends Adw.PreferencesPage {
    _init(settings, settingsKey) {
        super._init({
            title: _('Extensão'),
            icon_name: 'video-display-symbolic',
            name: 'ExtensionPage'
        });
        this._settings = settings;
        this._settingsKey = settingsKey;

        // Grupo Animação
        // --------------
        let animationGroup = new Adw.PreferencesGroup({
            title: _('Animação')
        });

        // Items do grupo
        const animationSwitch = new Gtk.Switch({
            active: this._settings.get_boolean(this._settingsKey.ANIMATION_START),
            valign: Gtk.Align.CENTER,
        });

        let animationRow = new Adw.ExpanderRow({
            title: _('Habilitar animação'),
            subtitle: _('Deixar habiliatado a animação do ícone da systray no carregamento da extensão'),
            //show_enable_switch: true, // Evento (notify::active) não funciona
            enable_expansion: this._settings.get_boolean(this._settingsKey.ANIMATION_START),
            subtitle_lines: 2,
        });
        animationRow.add_action(animationSwitch);

        const animationSpin = new Gtk.SpinButton({
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 60,
                step_increment: 1,
                page_increment: 1,
                page_size: 0,
                value: this._settings.get_int(this._settingsKey.ANIMATION_REFRESH)
            }),
            climb_rate: 1,
            digits: 0,
            numeric: true,
            valign: Gtk.Align.CENTER
        });

        let animationRefreshRow = new Adw.ActionRow({
            title: _('Atualização'),
            subtitle: _('Tempo de atualização do ícone da systray (em segubndos)'),
            activatable_widget: animationSpin
        });
        animationRefreshRow.add_suffix(animationSpin);

        // Adicionando elementos
        animationRow.add_row(animationRefreshRow);
        animationGroup.add(animationRow);
        this.add(animationGroup);

        // Conectando os eventos
        animationSwitch.connect('notify::active', (widget) => {
            if (widget.get_active()) {
                animationRow.set_expanded(true);
                animationRow.set_enable_expansion(true);
            } else {
                animationRow.set_expanded(false);
                animationRow.set_enable_expansion(false);
            }
            this._settings.set_boolean(
                this._settingsKey.ANIMATION_START, widget.get_active()
            );
        });
        animationSpin.connect('value-changed', (widget) => {
            this._settings.set_int(
                this._settingsKey.ANIMATION_REFRESH, widget.get_value()
            );
        });
    }
});
