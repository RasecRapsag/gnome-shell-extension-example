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
