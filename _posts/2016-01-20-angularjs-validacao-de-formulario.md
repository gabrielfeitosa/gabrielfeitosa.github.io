---
title: 'AngularJS: Validação de formulário'
date: 2016-01-20T10:50:26+00:00
layout: post
permalink: /angularjs-validacao-de-formulario/
comments: true
categories:
  - AngularJs
tags:
  - angular
  - angularjs
  - form-validation
  - javascript
---
Fala galera!

O post de hoje vai ser bem simples e direto: **validar formulário com o AngularJS**. Vamos ver passo a passo como é fácil e como esse framework é potente também na validação? Simbora&#8230;

O código abaixo será a base do formulário das validações. Como podemos ver, ele é apenas um simples formulário para validar um saque em um caixa.

{% highlight html linenos%}
<!DOCTYPE html>
<html ng-app="app">
  <head>
    <meta charset="utf-8" />
    <title>Blog do Gabriel Feitosa</title>
  </head>
  <body>
    <h1>AngularJS: Validação de Formulário</h1>
    <div ng-controller="CaixaController as vm">
      <form name="form" novalidate ng-submit="vm.sacar()">
        <table>
          <tr>
            <td>Quanto vai sacar?</td>
            <td> <input type="number" name="valor" ng-model="vm.valor" required> </td>
          </tr>
          <tr>
            <td> Senha: </td>
            <td> <input type="password" name="senha" ng-model="vm.senha" required> </td>
          </tr>
        </table>
        <br>
        <button type="submit">Sacar</button>
      </form>
    </div>
    <footer>
      <hr/><a href="http://www.gabrielfeitosa.github.io"> Blog do Gabriel Feitosa</a>
    </footer>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>
    <script src="app.js"></script>
  </body>
</html>
{% endhighlight %}
Algumas considerações relevantes do nosso formulário:

<!--more-->

  * Ele possui um nome (**form**), que servirá para a nossa validação;
  * Possui o atributo de **novalidate**, assim evitamos as caixas de diálogo do próprio browser;
  * Perceba que nossos _inputs_ possuem o atributo de **required,** onde definimos que eles são obrigatórios;
  * Para submeter o formulário, você poderá optar por duas ações: **ng-submit **no formulário e/ou **ng-click **no botão. Particularmente, prefiro **ng-submit **no formulário e o botão de submissão com o **type=submit**.

Com o formulário pronto, vamos adicionar a validação para evitar os erros na hora de sacar o nosso suado dinheiro!

## Desabilitando o botão de submissão do formulário

A primeira mudança é evitar a submissão do formulário sem todos os dados válidos. Para isso, vamos adicionar a diretiva **ng-disabled **no nosso botão:

`<button type="submit" <strong>ng-disabled="!form.$valid"</strong>>Sacar</button>`

> **[Dica importante]**
  Nesse caso de submissão do formulário, utilize sempre o <strong>$valid</strong> em vez de <strong>$invalid</strong>, pois, há um terceiro estado que o AngularJS provê que é o <strong>$pending</strong>. Ou seja, quando o formulário <strong>não</strong> está inválido não quer dizer que ele esteja válido, pois pode estar no status de pendente.

## Adicionando validação ao input

Agora que não há como submeter o formulário sem todos os dados válidos, vamos tornar o nosso caixa mais inteligente. Que tal fazermos uma validação do saldo antes mesmo de digitar a senha?

Para isso, vamos criar uma diretiva que fará essa validação:

{% highlight javascript linenos %}
angular.module('app').directive('saque', function() {
  return {
    require: 'ngModel',
    controller: function($element) {
      var ctrl = $element.controller('ngModel');
      ctrl.$validators.valor =
        function(modelValue, viewValue) {
          return viewValue && viewValue < 500;
      };
    }
  }
});
{% endhighlight %}

Em seguida, adicionamos a diretiva **saque** como um atributo do nosso input:

`<input type="number" name="valor" ng-model="vm.valor" required saque>`

Com a diretiva no nosso input, só será possível realizar um saque inferior a 500. Beleza, mas e como é que essa diretiva funciona?

A explicação é bem simples. A diretiva exige que o elemento tenha o **ngModel **e através dele nós temos acesso ao **<a href="https://docs.angularjs.org/api/ng/type/ngModel.NgModelController" target="_blank">ngModelController</a> **(linha 5). Então, na linha 6 é adicionada a validação para o **valor** (mesmo nome do ngModel da view)** **no controlador. Moleza, né não?

## Adicionando validação de forma assíncrona

Vamos fazer mais uma implementação? Garanto que vai ser bacana&#8230; Que tal fazermos essa validação de forma assíncrona? Ir lá no servidor e verificar se eu tenho esse saldo mesmo.

Vamos criar uma nova diretiva chamada **saque-assync:**

{% highlight javascript linenos%}
angular.module('app').directive('saqueAsync', function($timeout, $q) {
  return {
    require: 'ngModel',
    controller: function($element) {
      var ctrl = $element.controller('ngModel');
      ctrl.$asyncValidators.saqueAsync =
        function(modelValue, viewValue) {
          return $timeout(function() {}, 1800).then(function() {
            var saldoDisponivel = 900;
            if (!viewValue || viewValue > saldoDisponivel) {
                return $q.reject();
            }
            return $q.resolve();
          }).catch(function(rejection) {
            ctrl.$setTouched();
            return $q.reject(rejection);
          });;
      };
    }
  };
});
{% endhighlight %}

A validação assíncrona tem uma exigência que é uma **promise**. Por esse motivo e para simular o servidor, utilizei o service **$timeout** (já falei sobre ele <a href="https://gabrielfeitosa.github.io/angularjs-refresh-periodico/" target="_blank">aqui</a>). O funcionamento dessa diretiva é bem semelhante a anterior, a diferença está no uso do **<a href="https://docs.angularjs.org/api/ng/type/ngModel.NgModelController#$asyncValidators" target="_blank">$asyncValidators</a>** em vez de **<a href="https://docs.angularjs.org/api/ng/type/ngModel.NgModelController#$validators" target="_blank">$validators</a>** e na exigência da promise, como dito anteriormente.

Para verificar se a diretiva está fazendo a validação de forma assíncrona, podemos adicionar uma mensagem ao nosso html para ser exibida no momento da validação. Lembra que falei que o AngularJS fornece três status ($valid, $invalid e $pending) ? Pois é, agora é a hora de utilizarmos o **$pending.**

Adicione ao seu html o trecho de código abaixo:

`<div ng-if=form.valor.$pending.saqueAsync>Será que tem saldo nessa conta?</div>`

Agora, quando a validação assíncrona estiver sendo executada a mensagem "Será que tem saldo nessa conta?" será exibida.

## Exibindo mensagens de erro

Aproveitando o gancho da validação do saque na conta, vamos exibir as mensagens de erro do nosso formulário. Há algumas maneiras de exibir a mensagem de validação, uma delas é utilizar o módulo **<a href="https://docs.angularjs.org/api/ngMessages/directive/ngMessages" target="_blank">ng-messages</a> **(recomendo). Mas, como nem  tudo são flores, essa parte vou deixar como dever de casa para os interessados.

No exemplo desse post não utilizei o módulo. Veja:

{% highlight html%}
<div ng-if="form.valor.$invalid && form.valor.$touched" style="color:red">
  <div ng-if="form.valor.$error.required">Valor do saque é obrigatório</div>
  <div ng-if="form.valor.$error.saqueAsync">Vixe&#8230; Ta liso!</div>
</div>
{% endhighlight %}

Note que no **ng-if** testo se o meu elemento **valor** está inválido** (****$invalid).** Existe** **a verificação se houve alguma interação do usuário com o elemento através do **$touched**. Isso ocorre para evitar que a mensagem seja exibida antes do usuário ter alguma interação com o campo.

Perceba também que na diretiva da validação assíncrona eu forcei essa interação utilizando o **<a href="https://docs.angularjs.org/api/ng/type/ngModel.NgModelController#$setTouched" target="_blank">$setTouched</a>.**

Na <a href="https://docs.angularjs.org/guide/forms" target="_blank">documentação oficial</a>, há outras funcionalidades que não abordei aqui para validar formulários. Vale muito a pena conferir!

<a href="https://gabrielfeitosa.github.io/exemplos/angularjs/form-validation/index.html" target="_blank">Aqui </a>você poderá ver o código rodando. Os fontes estão <a href="https://github.com/gabrielfeitosa/angularjs-form-validation" target="_blank">aqui</a>.

Então é isso galera, fazer validação com o angular é bem simples. Espero que tenham curtido.

Abraços e até a próxima!