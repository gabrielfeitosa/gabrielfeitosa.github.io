---
title: 'AngularJS: Introdução'
date: 2015-07-28T16:36:10+00:00
layout: post
permalink: /iniciando-com-angularjs/
comments: true
categories: 
  - AngularJs
tags: 
  - angularjs
  - frontend
  - html
  - javascript
---
E aí pessoal, beleza?

Vamos falar um pouco sobre [AngularJS](https://angularjs.org/)?

Para quem não conhece ele é um framework JavaScript, com base no modelo de arquitetura Model View Whatever (MVW). Nasceu dentro do Google em meados de 2009, mais precisamente pelas mãos de Misko Hevery, ta aí o twitter dele [@mhevery](https://twitter.com/mhevery).

Quando comecei a estudá-lo, uma das _features_ que me chamou bastante a atenção foi o **_[Two-way Data Binding](https://docs.angularjs.org/guide/databinding). _**Mas o que é esse tal de _Two-way Data Binding_? Ele é quem faz boa parte da mágica, já que é o responsável pela sincronização dos dados entre os controladores (_Model_) e os componentes de visão (_View_).

Mas agora chega de história e bora espiar como ele funciona, o exemplo abaixo pode ser visto rodando <a href="http://plnkr.co/edit/XmYU3IakxpEWHqyR9SDX?p=preview" target="_blank">aqui</a>:

{% highlight html linenos %}
<!DOCTYPE html>
<html ng-app>
  <head>
   <meta charset="utf-8">	
  </head>

  <body>
    <input type="text" ng-model="nome" placeholder="Diz teu nome aí">
    <h1>Eita {{nome}}, olha o two-way data binding funcionando!</h1>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular.min.js"></script>
  </body>
</html>
{% endhighlight %}

Primeira coisa que precisamos informar para o angular é a diretiva **_[ng-app](https://docs.angularjs.org/api/ng/directive/ngApp),_ **ela é usada para dizer qual o elemento raiz da aplicação, no nosso caso, a tag **_html_**.

O segundo detalhe é a diretiva **[ng-model](https://docs.angularjs.org/api/ng/directive/ngModel)**, que tem a responsabilidade de fazer o _binding _da _view_ com o _model._

E por último, mas não menos importante, é o uso da expressão **&#123;&#123;nome}}**. Nesse caso ela irá imprimir o valor da variável **nome**, que foi definida na diretira ng-model**. **

E aí, simples não é mesmo?

O [site](https://angularjs.org/) oficial tem uma documentação muito boa, o [tutorial](https://docs.angularjs.org/tutorial) disponibilizado por eles não faz somente o feijão com arroz e permite um tour em muitas _features_ para mostrar o poder que o framework tem. Agora que você tem uma ideia do que o angular é capaz, eu recomendo que dê uma espiada lá.

E para fechar, uma informação muito importante, há uma nova versão sendo desenvolvida, o [Angular 2.0](https://angular.io/).

Abraços e até a próxima!