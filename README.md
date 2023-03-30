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

echo "Debug de um extensão específica"
journalctl -f -o cat GNOME_SHELL_EXTENSION_UUID=gnome-shell-extension@rasec.rapsag

echo "Debug pref"
journalctl -f -o cat /usr/bin/gjs
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

## Traduções (Locales)

Criamos uma pasta locale na raiz do projeto, onde ficaram os diretórios e arquivos de traduções. Geramos 3 tipos de arquivos para a tradução:

- **locale.pot**: Arquivo gerado extraindo as strings do código da extensão
- **locale.po**: Arquivo gerado após termos adicionado as traduções
- **locale.mo**: Arquivo binário que será distribuido no pacote

Após editarmos o arquivo.pot geramos o arquivo.po. O arquivo.po já traduz o texto de acordo com a localização do Gnome utilizado, mas o ideal é adicionar ao pacote somente o compilado arquivo.mo.

```zsh
echo "Extraindo as strings possíveis de serem traduzidas"
xgettext --from-code=UTF-8 --no-wrap --output=gnome-shell-extension@rasec.rapsag.pot *.js

echo "Atualizando arquivo com as strings"
xgettext -j --from-code=UTF-8 --no-wrap --output=gnome-shell-extension@rasec.rapsag.pot *.js

echo "Criando um arquivo de tradução (en_US)"
mkdir -pv locale
msginit --locale en_US --input gnome-shell-extension@rasec.rapsag.pot --output locale/en_US.po

echo "Após editar as string traduzidas, geramos o arquivo (mo)"
mkdir -pv locale/en_US/LC_MESSAGES
msgfmt locale/en_US.po --output-file=locale/en_US/LC_MESSAGES/gnome-shell-extension@rasec.rapsag.mo
```

## Gerando pacote para distribuição

```zsh
echo "Gerando pacote simples"
gnome-extensions pack --podir=locale .

echo "Gerando pacote com mais arquivos"
gnome-extensions pack --podir=locale --extra-source=indicator.js --extra-source=setting.js --extra-source=dates.js .
```
