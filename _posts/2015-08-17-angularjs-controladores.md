---
title: 'AngularJS: Controladores (Controllers)'
date: 2015-08-17T10:34:02+00:00
layout: post
permalink: /angularjs-controladores/
categories:
  - AngularJs
tags:
  - angular
  - angularjs
  - boas práticas
  - controladores
  - controllers
  - frontend
comments: true
---
Olá pessoal, beleza?

No post anterior, [Introdução ao AngularJS](https://gabrielfeitosa.github.io/iniciando-com-angularjs/), fizemos uma explanação sobre algumas características importantes do AngularJS. Hoje vamos falar sobre os controladores e as boas práticas que podem ser adotadas em sua utilização.

# Entendendo os Controladores

Os Controladores (_Controllers_), como o próprio nome diz, são responsáveis pelo controle da aplicação. É neles que gerenciamos o fluxo de dados apresentados na _view_. Quando um controlador é anexado ao DOM, via _ng-controller_, um novo objeto do controlador será instanciado, de acordo com a especificação do construtor. Na sequência, um novo escopo (_$scope_) filho será criado e disponibilizado como um parâmetro injetável no construtor do controlador.
<!--more-->

> **[Boa Prática]**
1. O controlador deve ser utilizado **apenas** para a lógica de negócio da aplicação. É nele que devemos setar o estado inicial do $scope e/ou adicionar comportamento.
2. **Não** é recomendado usá-lo para:
   * __Manipular o DOM__: para a manipulação do DOM é aconselhável utilizar [diretivas](https://docs.angularjs.org/guide/directive), com o intúito de encapsular esse comportamento. Ademais, com essa prática o código fica mais manutenível e testável.
   * __Formatar Inputs__: para isso use os [controladores de formulários](https://docs.angularjs.org/guide/forms).
   * __Filtrar Dados__: o AngularJS dispõe de [filtros](https://docs.angularjs.org/guide/filter) padrão, além da opção de escrever filtros customizados.
   * __Compartilhar código__: para compartilhar estados ou dados com outros controladores devemos utilizar as [factories/services](https://docs.angularjs.org/guide/services).
{: .notice}

Vamos pegar o exemplo do post [Introdução ao AngularJS](https://gabrielfeitosa.github.io/iniciando-com-angularjs/) e adicionar o controlador, [aqui](https://gabrielfeitosa.github.io/exemplos/angularjs/controller1.html) você pode vê-lo rodando:

{% highlight html linenos %}
<!DOCTYPE html>
<!--Declaração do módulo da aplicação-->
<html ng-app="app">

<head>
    <meta charset="utf-8">
    <title>Exemplo 1 - Blog do Gabriel Feitosa</title>
</head>

<body>
    <h1>Entendendo os Controladores</h1>
    <!--Declaração do nosso MeuController-->
    <div ng-controller="MeuController">
        <input type="text" ng-model="nome" placeholder="Diz teu nome aí" />
        <h1>Eita {{nome}}, o controlador setou o estado inicial do $scope.nome!</h1>
    </div>
    <footer>
        <hr>
        <a href="http://www.gabrielfeitosa.github.io"> Blog do Gabriel Feitosa</a>
    </footer>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular.min.js"></script>
    <script>
        //Declarando o módulo da aplicação	
        var app = angular.module('app', []);
        //Declarando o construtor do MeuController
        app.controller('MeuController', ['$scope', function($scope) {
            $scope.nome = 'Gabriel';
        }]);
    </script>
</body>

</html>
{% endhighlight %}

Neste exemplo, criamos o controlador (**MeuController**) no módulo __app__, utilizando o método **controller()**. Esse método o mantém fora do escopo global. O objeto $scope é inserido dentro do MeuController através do mecanismo de [injeção de dependência](https://docs.angularjs.org/guide/di). Depois utilizamos a diretiva _ng-controller_, na _div_, para anexar o nosso controlador ao DOM.

## Adicionando comportamento ao $scope

Quando queremos executar alguma ação na _view_, precisamos adicionar comportamento ao escopo. Antes disso, no entanto, é necessário anexar os métodos ao $scope. Assim, eles ficarão disponíveis para a camada de visão.

O código abaixo pode ser visto rodando **[aqui](https://gabrielfeitosa.github.io/exemplos/angularjs/controller2.html)**.

{% highlight html linenos %}
<!DOCTYPE html>
<html ng-app="app">

<head>
    <meta charset="utf-8" />
    <title>Exemplo 2 - Blog do Gabriel Feitosa</title>
</head>

<body>
    <h1>Entendendo os Controladores</h1>
    <div ng-controller="MeuController">
        <form>
            <input type="text" ng-model="item" placeholder="Informe um item" />
            <button ng-click="addItem()">Adicionar</button>
        </form>
        <br/>
        <h1> Itens</h1>
        <ul>
            <li ng-repeat="i in itens">{{i}}</li>
        </ul>
    </div>
    <footer>
        <hr/>
        <a href="http://www.gabrielfeitosa.github.io"> Blog do Gabriel Feitosa</a>
    </footer>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular.min.js"></script>
    <script>
        var app = angular.module('app', []);
        app.controller('MeuController', ['$scope', function($scope) {
            $scope.item = '';
            $scope.itens = [];
            $scope.addItem = function() {
                $scope.itens.push($scope.item);
                $scope.item = '';
            }
        }]);
    </script>
</body>

</html>
{% endhighlight %}

Para adicionar um item a lista de ítens, foi anexado ao **$scope** o método **addItem** ($scope.addItem). Já para utilizar o método addItem, utilizamos a diretiva _[ng-click](https://docs.angularjs.org/api/ngTouch/directive/ngClick)_. Sempre que houver o evento de _click_ no botão o método será chamado.

Para exibir os itens adicionados utilizamos a diretiva _[ng-repeat](https://docs.angularjs.org/api/ng/directive/ngRepeat)_. Quando um item for adicionado um novo elemento _<li>_ será criado.

> **Nota:** Para evitar o erro **_Error: ngRepeat:dupes_** na diretiva ng-repeat quando adicionamos ítens duplicados, é necessário usar o `track by`. O uso é indispensável porque o AngularJS utiliza uma chave única para ligar o nó do DOM ao elemento que está iterando. Mais detalhes sobre o assunto **[aqui](https://docs.angularjs.org/error/ngRepeat/dupes)**.

## Herança de $scope

Quando adicionamos os controllers em hierarquias, um dentro do outro, temos uma herança de escopos. Isso acontece porque a diretiva _ng-controller_ cria um novo $scope **filho**, então o $scope que cada controlador recebe terá acesso aos métodos e atributos do controlador acima na hierarquia.

O código abaixo pode ser visto rodando **[aqui](https://gabrielfeitosa.github.io/exemplos/angularjs/controller_heranca.html)**

{% highlight html linenos %}
<!DOCTYPE html>
<!--Declaração do módulo da aplicação-->
<html ng-app="app">
    <head>
        <meta charset="utf-8"/>
        <title>Exemplo 3 - Blog do Gabriel Feitosa</title>
        <style type="text/css">
            div.heranca div {
                padding: 5px;
                border: solid 2px #000;
            }
        </style>
    </head>
    <body>
        <h1>Entendendo os Controladores - Herança de $scope</h1>
        <!--Declaração do nosso MeuController-->
        <div class="heranca">
            <div ng-controller="PaiController">
                <p>Eu sou {{nome}} {{sobrenome}}!</p>
                <div ng-controller="FilhoController">
                    <p>Eu sou {{nome}} {{sobrenome}}</p>
                    <div ng-controller="NetoController">
                        <p>Eu sou {{nome}} {{sobrenome}}</p>
                    </div>
                </div>
            </div>
        </div>
        <footer>
            <hr/>
            <a href="http://www.gabrielfeitosa.github.io"> Blog do Gabriel Feitosa</a>
        </footer>
        <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular.min.js"></script>
        <script>
            var app = angular.module('app',[]);
            
            app.controller('PaiController',['$scope',function($scope){
                $scope.nome = 'Gabriel';
                $scope.sobrenome='Feitosa';
            }]); 
            
            app.controller('FilhoController',['$scope',function($scope){
                $scope.nome = 'Lampião';
            }]); 	
            
            app.controller('NetoController',['$scope',function($scope){
                $scope.sobrenome='Junior';
            }]); 	
        </script>
    </body>
</html>
{% endhighlight %}    

Como resultado desse aninhamento de controladores, são criados quatro objetos $scope (o root scope e um $scope para cada controlador). Para acessar uma propriedade do escopo pai, nós usamos o **$parent**.

Ainda há propriedades dos controladores que podem ser exploradas como, por exemplo, o uso do **controller as** ao invés do $scope. Vocês podem ver nesse [plunker](http://embed.plnkr.co/btUHhV/preview) um exemplo utilizando o _controller as_ e outras boas práticas, como o conceito de responsabilidade única (**single responsability**) para os arquivos javascript.

Por hoje é isso pessoal, espero que tenham gostado.

Abraços e até a próxima!
