# Exemplo de Extensão para o Gnome Shell

A versão do Gnome Shell onde foi escrito este exemplo é a versão 43.3.
Para se aprofundar no assunto podemos acessar a documentação da API para criação de aplicações Gnome em JavaScript.

## Documentação

* [Guia do Desenvolvedor](https://gjs.guide/)
* [API JavaScript do Gnome](https://gjs-docs.gnome.org/)


## Criando uma extensão

```zsh
gnome-extensions create --interactive

Name should be a very short (ideally descriptive) string.
Examples are: “Click To Focus”, “Adblock”, “Shell Window Shrinker”
Name: Example

Description is a single-sentence explanation of what your extension does.
Examples are: “Make windows visible on click”, “Block advertisement popups”, “Animate windows shrinking on minimize”
Description: Example Gnome Shell Extension

UUID is a globally-unique identifier for your extension.
This should be in the format of an email address (clicktofocus@janedoe.example.com)
UUID: example@example.com

Choose one of the available templates:
1) Plain       –  An empty extension
2) Indicator   –  Add an icon to the top bar
Template [1-2]: 1
```

## Habilitando a extensão

```zsh
echo "Carregando a extensão no Gnome Shell (X11)"
echo "Pressione Alt + F2 e depois digite: restart <ENTER>"

echo "Carregando a extensão no Gnome Shell (Wayland)"
dbus-run-session -- gnome-shell --nested --wayland

echo "Habilitando a extensão"
gnome-extensions enable example@example.com
```

## Fazendo debug da extensão

### Debug via terminal

```zsh
echo "Debug extension.js"
journalctl -f -o cat /usr/bin/gnome-shell

echo "Debug pref"
journalctl -f -o cat /usr/bin/gnome-shell-extension-prefs
```

### Debug no código JavaScript

```javasript
// Logar mensagem
log('Mensagem');

// Logar mensagem com rastreamento de pilha (logError)
try {
    throw new Error('Mensagem');
} catch (e) {
    logError(e, 'ExtensionErrorType');
}

// Exibir mensagem na saída padrão: stdout
print('Mensagem')

// Exibir mensagem na saída de erro: stderr
printerr('Mensagem')
```

## Schema

GSettings é onde armazenamos informações das aplicações que estamos criando, como se fosse um banco de dados.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<schemalist>
    
  <schema id="org.gnome.shell.extensions.example"
    path="/org/gnome/shell/extensions/example/">
    
    <key type="i" name="my-integer">
      <default>100</default>
      <summary>summary</summary>
      <description>description</description>
    </key>
    
  </schema>
  
</schemalist>
```
Para funcionar o schema, será necessário compilá-lo:

```zsh
echo "Compilando o arquivo de schemas"
glib-compile-schemas schemas/
```
