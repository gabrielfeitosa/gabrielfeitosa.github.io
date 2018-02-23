---
title: 'AngularJS: Componentizando os componentes'
date: 2016-10-11T08:50:18+00:00
layout: post
permalink: /angularjs-componentizando-os-componentes/
comments: true
categories:
  - AngularJs
tags:
  - angular
  - angularjs
  - diretiva
  - frontend
  - html
  - javascript
---
Fala galera, beleza?

Você aí que às vezes sofre quando o usuário decide mudar o css de um componente no sistema, por exemplo o ícone do botão salvar, esse post é para você!

Cansei de contar as vezes que precisei entrar em VÁRIAS telas do sistema e mudar como a tag do html ia ser renderizada ou alterar o seu comportamento padrão.  Alguns _devs_ tem uma velha desculpa: Ah Gabriel, mas tem a IDE para fazer isso por nós, o trabalho é mínimo!&#8230; Eu como um bom preguiçoso, não gosto é de ter trabalho algum.

Então, é aqui que entra  as diretivas do AngularJS (já bloguei um pouco sobre elas <a href="http://gabrielfeitosa.com/angularjs-diretiva-para-controle-de-acesso/" target="_blank">aqui</a>). As diretivas poderão facilitar nossa vida (e muito!) quando se trata de padronizar o nosso sistema. Não seria legal mudar em um único lugar e ter a certeza que todo o sistema sofreu a alteração!?
<!--more-->

## O exemplo

Vamos construir um elemento semelhante ao _**input**_ do html. Lembra que  através do atributo **_type_** é possível alterar a forma como o html é renderizado ( text, button, file, &#8230; )? Os valores válidos para o atributo type podem ser visto <a href="http://www.w3schools.com/tags/att_input_type.asp" target="_blank">nesse link</a>. O nosso componente também terá um comportamento semelhante.

O nome do novo componente será <**botao>** e ele terá três atributos: ** **

  1. **tipo:** será o responsável por definir qual o tipo de botão será exibido;
  2.  **label: **o nome que será exibido como label do botão;
  3. **click:** a ação que será executada ao clicar no botão;

Vamos analisar o gist abaixo com a implementação do componente:

{% highlight javascript linenos%}
(function () {
  angular.module('app', [])
    .directive('botao', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                label: '@',
                tipo: '@',
                acao: '&click'
            },
            controller: 'Controller as vm',
            templateUrl: function (elem, attrs) {
                return 'componentes/botao-' + (attrs.tipo || 'padrao') + '.html';
            }
        }
    })
    .controller('Controller', function () {
        var vm = this;

        vm.alertar = function (label) {
            alert(label);
        }

        vm.autorizar  =function (acao) {
            if(confirm("Confirmar operação?")){
                acao();
            }else{
                vm.alertar('Operação salvar cancelada...');
            }
        }
    });
})();
{% endhighlight %}

Podemos notar que o "pulo do gato" está na função **templateUrl** (linha 14). A nossa tag botao utiliza o atributo **tipo** para alterar o valor do nome do arquivo html (linha 15) que será exibido como template da nossa diretiva. Então, quando usarmos o nosso botão com o tipo "salvar" `<botao tipo="salvar" label="Salvar"></botao>` ele irá renderizar o arquivo **componentes/botao-salvar.html**.

Assim, construir novos elementos e/ou alterar o comportamento de um já existente fica bem simples. No exemplo, adicionei uma confirmação da ação para o botão salvar.

O código do exemplo pode ser encontrado no meu <a href="https://github.com/gabrielfeitosa/angularjs-padronizacao-componentes" target="_blank">github</a> e <a href="http://gabrielfeitosa.com/exemplos/angularjs/padronizacao-componentes/" target="_blank">aqui</a> tem o exemplo rodando.

E você, como está fazendo essa **padronização** no seu projeto?

O post de hoje foi só uma rapidinha, mas espero que tenham curtido.  😎

Abraços e até a próxima!