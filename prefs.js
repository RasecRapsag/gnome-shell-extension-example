'use strict';

const { Adw, Gio, Gtk, GObject } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const _ = ExtensionUtils.gettext;

var PrincipalPage = GObject.registerClass(
    class PrincipalPage extends Adw.PreferencesPage {
        _init(settings) {
            super._init({
                title: _('Principal'),
                icon_name: 'general-symbolic',
                name: 'PrincipalPage'
            });
            this._settings = settings;
            this._listAtalhos = [];

            // Grupo Comportamento
            let group = new Adw.PreferencesGroup({
                title: _('Grupo'),
                description: _('Descrição do Grupo')
            });

            /*
             * Cria um widget do tipo switch (my-boolean)
             */
            const switch_boolean = new Gtk.Switch({
                active: this._settings.get_boolean('my-boolean'),
                valign: Gtk.Align.CENTER,
            });

            let row_boolean = new Adw.ActionRow({
                title: _('Habilitar variável booleana'),
                subtitle: _('Configurando a variável my-boolean'),
                activatable_widget: switch_boolean
            });

            // Associar widget a linha
            row_boolean.add_suffix(switch_boolean);

            /*
             * Cria um widget do tipo SpinButton (my-double)
             */
            const spin_double = new Gtk.SpinButton({
                adjustment: new Gtk.Adjustment({
                    lower: -5.0,
                    upper: 5.0,
                    step_increment: 0.2,
                    page_increment: 1,
                    page_size: 0,
                    value: this._settings.get_double('my-double')
                }),
                climb_rate: 1,
                digits: 1,
                numeric: true,
                valign: Gtk.Align.CENTER
            });

            let row_double = new Adw.ActionRow({
                title: _('Selecionar variável do tipo real'),
                subtitle: _('Configurando a variável my-double'),
                activatable_widget: spin_double
            });
            row_double.add_suffix(spin_double);

            /*
             * Cria um widget do tipo Scale (my-integer)
             */
            const scale_integer = new Gtk.Scale({
                valign: 'center',
                hexpand: true,
                width_request: '200px',
                round_digits: false,
                draw_value: false,
                orientation: 'horizontal',
                digits: 0,
                adjustment: new Gtk.Adjustment({
                    lower: 0,
                    upper: 4,
                    step_increment: 0.1,
                    page_increment: 1,
                    value: this._settings.get_int('my-integer')
                })
            });

            let row_integer = new Adw.ActionRow({
                title: _('Selecionar variável do tipo inteiro'),
                activatable: true,
                activatable_widget: scale_integer
            });
            row_integer.set_subtitle(_('Configurando a variável my-integer (0, 1, 2, 3, 4)'));
            scale_integer.add_mark(0, Gtk.PositionType.BOTTOM, null);
            scale_integer.add_mark(1, Gtk.PositionType.BOTTOM, null);
            scale_integer.add_mark(2, Gtk.PositionType.BOTTOM, null);
            scale_integer.add_mark(3, Gtk.PositionType.BOTTOM, null);
            scale_integer.add_mark(4, Gtk.PositionType.BOTTOM, null);
            row_integer.add_suffix(scale_integer);

            /*
             * Cria um widget do tipo ComboBox/StringList (my-enum)
             */
            const COMBOBOX = {
                TOP: _('Topo'),
                BOTTOM: _('Fundo'),
                RIGHT: _('Direita'),
                LEFT: _('Esquerda'),
            };
            let enumerando = new Adw.PreferencesGroup({
                title: _(this._settings.get_string('my-string'))
            });

            let list_enum = new Gtk.StringList();
            list_enum.append(COMBOBOX.TOP);
            list_enum.append(COMBOBOX.BOTTOM);
            list_enum.append(COMBOBOX.RIGHT);
            list_enum.append(COMBOBOX.LEFT);

            let row_enum = new Adw.ComboRow({
                title: _('Selecionar variável do tipo enum'),
                subtitle: _('Configurando a variável my-enum'),
                model: list_enum,
                selected: this._settings.get_enum('my-enum')
            });

            /*
             * Cria um widget do tipo ShortcutSetting (my-array)
             */
            let atalho = new Adw.PreferencesGroup({
                title: _("Trabalhando com Array"),
                description: _('Lendo e exibindo valores de my-array')
            });

            let listBox = new Gtk.ListBox();

            this._listAtalhos = this._settings.get_strv('my-array');

            for (let i = 0; i < this._listAtalhos.length; i++) {
                listBox.insert(new Gtk.Label({ label: this._listAtalhos[i], xalign: 0 }), i);
            }

            //
            // Conectando os evento aos items
            //
            switch_boolean.connect('notify::active', (widget) => {
                this._settings.set_boolean('my-boolean', widget.get_active());
            });
            spin_double.connect('value-changed', (widget) => {
                this._settings.set_double('my-double', widget.get_value());
            });
            scale_integer.connect('value-changed', (widget) => {
                this._settings.set_int('my-integer', widget.get_value());
            });
            row_enum.connect('notify::selected', (widget) => {
                this._settings.set_enum('my-enum', widget.selected);
            });

            // Adicionando elementos
            group.add(row_boolean);
            group.add(row_double);
            group.add(row_integer);
            this.add(group);

            enumerando.add(row_enum);
            this.add(enumerando);

            atalho.add(listBox);
            this.add(atalho);
        }
});

function init() {
    ExtensionUtils.initTranslations(Me.metadata['gettext-domain']);
}

function fillPreferencesWindow(window) {
    // Use the same GSettings schema as in `extension.js`
    const settings = ExtensionUtils.getSettings(
        'org.gnome.shell.extensions.gnome-shell-extension'
    );

    const principalPage = new PrincipalPage(settings);
    window.add(principalPage);
}
