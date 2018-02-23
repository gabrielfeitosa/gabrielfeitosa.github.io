---
title: 'AngularJS: Services'
date: 2015-08-26T09:15:23+00:00
layout: post
permalink: /angularjs-services/
comments: true
categories:
  - AngularJs
tags:
  - angular
  - angularjs
  - factory
  - frontend
  - html
  - javascript
  - service
---
E aí pessoal, beleza?

No post [anterior](http://gabrielfeitosa.com/angularjs-controladores/) falamos sobre os controladores e boas práticas na sua utilização. Hoje vamos abordar um pouco sobre os _services._

## Services - O que são? Para que servem?

Service é o objeto usado para organizar e/ou compartilhar estados de objetos e as regras de negócio da aplicação. Ele é **singleton**, ou seja, há apenas uma instância disponível durante a vida útil da aplicação. Outra característica importante é a inicialização tardia (**_lazily instantiated_**), que só é efetuada quando o AngularJS identifica que tem algum componente dependente.

Opa, espera aí! O _controller_ não é o lugar de controle da view? Logo, não é nele que eu tenho que ter as regras de negócio? Sim, o controller de fato controla a camada de visão, porém, não é ele que armazena as regras que são compartilhadas na aplicação. O controller gerencia apenas as regras referentes a _view_ a qual está associado.  Vou enumerar porquê as regras devem ir para um service:
<!--more-->

1. O **controlador** é criado sempre que acessamos a _view_ que o tem como dependência e é destruído assim que essa dependencia não é mais necessária, por exemplo, quando há mudança na rota e a _view_ é substituída por uma nova. Então, quando queremos que o estado do objeto tenha o ciclo de vida independente da camada de visão, usamos _service_ por ser _singleton;_
2. Através da injeção de dependência do AngularJS, o _service_ pode ser utilizado por toda a aplicação. O controlador tem a limitação de não ser instanciado pelo _provider_, o serviço _**$controller**_ é o responsável por iniciá-lo. **[Aqui](https://github.com/angular/angular.js/wiki/Understanding-Dependency-Injection)** você tem mais detalhes sobre a injeção de dependência do AngulaJS, **recomendo a leitura**;
3. O AngularJS dispõe de uma vasta opção de _services_, por exemplo o [$http](https://docs.angularjs.org/api/ng/service/$http), para facilitar a comunicação remota. Além disso, é muito fácil criar o nosso próprio serviço, na sequência vou mostrar como fazer =);
4. A centralização das regras em um service facilita na manutenabilidade e testabilidade do código.
{: .notice} 
  
## Usando um _service_
  
Agora que expliquei alguns conceitos sobre _services_, vamos exemplificar a utilização do _[$window](https://docs.angularjs.org/api/ng/service/$window)_. Para utilizá-lo você deve adicionar a dependência no componente (_controller, directive, filter ou service_) que dependerá do serviço. No exemplo abaixo, que pode ser visto rodando [aqui](http://gabrielfeitosa.com/exemplos/angularjs/services/service_alert.html), vamos exibir um alerta de uma mensagem informada pelo usuário:

{% highlight html linenos%}       
<!DOCTYPE html>
<html ng-app="app">
<head>
    <meta charset="utf-8" />
    <title>Blog do Gabriel Feitosa</title>
</head>
<body>
    <h1>Usando o service $window</h1>
    <!--Declaração do controlador AlertController e definição do nome que será usado para utilização 'ctrl'-->
    <div ng-controller="AlertController as ctrl">
        <fieldset>
            <legend>Criador de alertas</legend>
            <input ng-model="ctrl.alerta.mensagem" placeholder="Qual o mensagem de alerta?" />
            <br>
            <button ng-click="ctrl.enviar()">Enviar</button>
        </fieldset>
    </div>
    <footer>
        <hr/>
        <a href="http://www.gabrielfeitosa.com"> Blog do Gabriel Feitosa</a>
    </footer>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular.min.js"></script>
    <script>
        var app = angular.module('app', []);
        app.controller('AlertController', ['$window', function($window) {
            var self = this;
            self.alerta = {
                mensagem: ''
            };
            self.enviar = enviar;
            function enviar() {
                $window.alert('Mensagem criada : ' + self.alerta.mensagem);
            }
        }]);
    </script>
</body>
</html>
{% endhighlight %}   

O controlador **AlertController** (linha 25) possui o _$window_ como dependência. Quando o usuário informa a mensagem (linha 13) e a envia para o controlador (linha 15), utilizando a diretiva _ng-click_ do botão, o controlador utiliza o serviço **_$window.alert_** (linha 34) para exibí-la em um _alert_ na tela.
  
Na [API de referência](https://docs.angularjs.org/api) você pode verificar os _services_ disponíveis no core do AngularJS.

## Criando nosso próprio _service_
  
Agora que já sabemos como usar, vamos criar um serviço próprio. Você é livre para definir qual o nome do seu serviço, mas aconselho **nunca** utilizar o símbolo **$** no começo do nome, pois os _services_ do AngularJS começam com **$**, o que pode gerar conflito. Há três maneiras de se criar um serviço (_factory_, _service_ e _provider_), **recomendo** que leia no [stackoverflow](http://stackoverflow.com/questions/15666048/service-vs-provider-vs-factory) a explicação dada por um usuário sobre as diferenças entre esses tipos.

No exemplo abaixo, foi criado um serviço **MensagemFactory** utilizando o **_factory()_**. Essa factory está sendo usada por dois controladores distintos (**FofoqueiroController** e **VizinhoChatoController**). Ele pode ser visto rodando [aqui](http://gabrielfeitosa.com/exemplos/angularjs/services/service_fofoqueiro.html).

{% highlight html linenos%}  
{% raw %}
<!DOCTYPE html>
<html ng-app="app">
<head>
    <meta charset="utf-8" />
    <title>Blog do Gabriel Feitosa</title>
    <style type="text/css">
        button {
            background-color: red;
            color: white;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>Factory</h1>
    <div ng-controller="FofoqueiroController as fofoqueiro">
        <fieldset>
            <legend>Fofoqueiro Controller</legend>
            <input ng-model="mensagem" ng-change="fofoqueiro.fofocar(mensagem)" placeholder="Qual a fofoca de hoje?" />
            <br>
            <span>O fofoqueiro disse <b>{{fofoqueiro.falou()}}</b></span>
        </fieldset>
    </div>
    <br>
    <div ng-controller="VizinhoChatoController as vizinhoChato">
        <fieldset>
            <legend>Vizinho Chato Controller</legend>
            <span>O vizinho chato ouviu: <b>{{vizinhoChato.escutou()}}</b></span>
            <br>
            <button style="" ng-click="vizinhoChato.espalhaFofoca()">Espalhar Fofoca</button>
        </fieldset>
    </div>
    <footer>
        <hr/>
        <a href="http://www.gabrielfeitosa.com"> Blog do Gabriel Feitosa</a>
    </footer>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular.min.js"></script>
    <script>
        var app = angular.module('app', []);
        app.controller('FofoqueiroController', ['MensagemFactory', function(Mensagem) {
            var self = this;
            self.falou = Mensagem.get;
            self.fofocar = Mensagem.set;
        }]);
        app.controller('VizinhoChatoController', ['MensagemFactory', function(Mensagem) {
            var self = this;
            self.escutou = Mensagem.get;
            self.espalhaFofoca = Mensagem.alertar;
        }]);
        app.factory('MensagemFactory', function($window) {
            var mensagem = {
                texto: ''
            };
            return {
                get: function() {
                    return mensagem.texto;
                },
                set: function(tx) {
                    mensagem.texto = tx;
                },
                alertar: function() {
                    $window.alert(mensagem.texto);
                }
            }
        });
    </script>
</body>
</html>
{% endraw %}
{% endhighlight %}

O controlador **FofoqueiroController** possui as _functions_ **falou()** (linha 35) e **fofocar()** (linha 36). Quando um usuário fofoca alguma coisa utilizando o _input_ e envia essa fofoca, o método **fofocar()** irá chamar a função **Mensagem.set**, passando como parâmetro a mensagem (linha 14).

O controlador **VizinhoChatoController** possui a _function **escutou()**_ (linha 41) , que nada mais é que a função **Mensagem.get**. Quando a mensagem é modificada pelo FofoqueiroController, ele está ,na verdade, modificando o estado da mensagem do _service_ criado. Por esse motivo, o estado da mensagem exibida no VizinhoChatoController é automaticamente alterado também.

Como podemos ver no exemplo do Fofoqueiro, os _services_ também tem suas dependências. Assim como declaramos a dependência no controlador, a **MensagemFactory** tem igualmente uma dependência do **$window**.
  
> Como boa prática, utilizo o _**factory**_ para minhas regras de negócio e o _**service**_ para realizar a comunicação externa (comunicação com o servidor). No caso do _**provider**_ eu o utilizo quando preciso configurar algum _service_ dentro do **[config()](https://docs.angularjs.org/api/ng/type/angular.Module)**, por exemplo, quando quero setar variáveis de ambiente em um _service_.

Por hoje é isso pessoal, espero que tenham curtido o post.

Abraços e até a próxima!
