/**
 * Biblioteca para manipular Datas
 */
'use strict'

const GLib = imports.gi.GLib;

function getNow(format) {
    /* Data com Glib */
    let now = GLib.DateTime.new_now_local();
    return now.format(format);
}
