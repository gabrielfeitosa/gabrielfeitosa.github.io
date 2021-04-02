---
title: 'AngularJS: Rotas (ngRoute)'
date: 2015-09-14T09:42:19+00:00
layout: post
permalink: /angularjs-route/
comments: true
categories:
  - AngularJs
tags:
  - angular
  - angular-route
  - angularjs
  - frontend
  - ngRoute
  - rotas
  - router
---
E aí galera, beleza?

Hoje falaremos um pouco sobre as rotas (_<a href="https://docs.angularjs.org/api/ngRoute" target="_blank">ngRoute</a>_) do AngularJS. Nos posts anteriores falamos sobre <a href="https://gabrielfeitosa.com/angularjs-controladores/" target="_blank">controladores</a> e <a href="https://gabrielfeitosa.com/angularjs-services/" target="_blank">serviços</a>, se você ainda não está familiarizado com o framework recomendo a leitura.
<!--more-->

# Rotas &#8211; Para que servem?

Em aplicações que utilizam o conceito de _single page_, a navegação de uma página para outra é crucial. Quando a aplicação cresce e se torna mais complexa, precisamos encontrar uma maneira de gerenciar as páginas pelas quais o usuário vai navegar através da aplicação.

Poderíamos fazer toda a aplicação em um único arquivo e gerenciar o modo que a tela se comporta fazendo um gerenciamento de estados (por exemplo, escondendo e exibindo componentes), porém, já sabemos que fazer isso é completamente inviável para manutenção e saúde da aplicação (e da nossa querida saúde também!).

O módulo **_ngRoute_** é a solução que precisávamos. Ele nos permite gerenciar os templates a serem inseridos na _view_ de acordo com a navegação do usuário. Ou seja, quando há uma ação de mudança de página, o módulo é capaz de &#8220;injetar&#8221; o template correspondente (desce mais um pouquinho que te mostro como faz).

## Como configurar?

O serviço _<a href="https://docs.angularjs.org/api/ngRoute/provider/$routeProvider" target="_blank">$routeProvider</a>_, que faz parte do módulo _ngRoute_, é utilizado para realizar a configuração das rotas. Ele facilita a conexão do controlador com o template (_view_) e a URL que será mapeada com a rota. Com esse recurso, podemos utilizar o histórico do navegador e os favoritos.

**Nota**: <em>$routeProvider</em> é o provider do serviço <em><a href="https://docs.angularjs.org/api/ngRoute/service/$route" target="_blank">$route</a>. </em>Por se tratar de um provider, ele só pode ser injetado dentro da função <em>config. </em>Portanto, não podemos utilizar <em>$routeProvider</em> dentro de um controlador.
{: .notice}

### Instalação

Para utilizar o _**angular-route**_ em nossa aplicação, precisamos adicionar a referência do javascript <span style="text-decoration: underline;">após</span> a referência do próprio AngularJS.

<pre>&lt;script src="//code.angularjs.org/1.4.4/angular-route.js"&gt;&lt;/script&gt;</pre>

Depois, devemos adicionar a dependência do módulo **ngRoute **a nossa app.

<pre>angular.module('feira-app',['ngRoute'])</pre>

### Template

Para utilizar um template, é necessário combinar a diretiva _**ng-view**_ (linha 10)** **com a rota. Essa diretiva nos permite especificar exatamente onde no DOM nós queremos renderizar o template de acordo com a rota atual.

{% highlight html linenos%}  
{% raw %}
<!DOCTYPE html>
<html ng-app="feira-app">
<head>
  <meta charset="UTF-8">
  <title>Blog do Gabriel Feitosa > AngularJS: Rotas (ngRoute)</title>
</head>
<body>
  <h1>Animais para Adoção</h1>
  
  <div ng-view style="border: 1px solid"></div>
  
  <div>
    <p><b>Vamos ver o que está acontecendo?</b></p>
    <pre>Path ($location.path()) = {{$location.path()}}</pre>
    <pre>Template ($route.current.templateUrl) = {{$route.current.templateUrl}}</pre>
    <pre>Controlador ($route.current.controller) = {{$route.current.controller}}</pre>
    <pre>Titulo da Página ($route.current.scope.titulo) = {{$route.current.scope.titulo}}</pre>
    <pre>Parâmetros da URL ($routeParams) = {{$routeParams}}</pre>
  </div>
  <footer>
      <hr/>
      <a href="http://www.gabrielfeitosa.com"> Blog do Gabriel Feitosa</a>
  </footer>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular.min.js"></script>
  <script src="//code.angularjs.org/1.4.4/angular-route.js"></script>
  <script src="js/app.js"></script>
  <script src="js/config.js"></script>
  <script src="js/animal.lista.controller.js"></script>
  <script src="js/animal.detalhe.controller.js"></script>
  <script src="js/animal.factory.js"></script>
</body>
</html>  
{% endraw %} 
{% endhighlight %}

Por enquanto não vamos nos preocupar com o restante do código, principalmente os que estão entre as linhas 14 e 18, explicarei na sessão de eventos.

A diretiva _ngView_ segue os seguintes passos:

  * Toda vez que o evento <a href="https://docs.angularjs.org/api/ngRoute/service/$route#$routeChangeSuccess" target="_blank">$routeChangeSucess</a> é disparado, a _view_ é atualizada;
  * Se houver um template associado com a rota atual, um novo escopo é criado;
  * A última _view _é removida e, consequentemente, o último escopo é limpo;
  * O novo escopo é vinculado ao novo template;
  * O controlador é vinculado ao escopo, caso haja um controlador para a rota;
  * O evento <a href="https://docs.angularjs.org/api/ngRoute/directive/ngView#$viewContentLoaded" target="_blank">$viewContentLoaded</a> é disparado.

## Configurando as Rotas

A configuração das rotas se dá através dos métodos _**when**_ e _**otherwise**_ do serviço _$routeProvide._ Na nossa aplicação, ele está sendo injetado dentro da função _config_ (linha 6).

{% highlight javascript linenos%}
{% raw %} 
(function() {
  'use strict';

  angular.module('feira-app')
    .config(function($routeProvider) {
      $routeProvider
        .when('/animais', {
          templateUrl: 'lista.html',
          controller: 'AnimalListaController'
        })
        .when('/animais/:id', {
          templateUrl: 'detalhe.html',
          controller: 'AnimalDetalheController'
        }).otherwise({
          redirectTo: '/animais'
        });
    });
})();
{% endraw %} 
{% endhighlight %}

O método _when_ (linha 7), recebe dois parâmetros (_**path**_ e _**route**_):

O primeiro parâmetro é o **_path_** da rota, que é comparado ao _$location.path_ da URL atual. Podemos passar um parâmetro na URL utilizando o `:param`, como na nossa rota **/animais:id**. O resgate desse parâmetro é feito no service **_$routeparams_** (linha 18 - index.html).

O segundo parâmetro é o objeto de configuração da rota. É neste momento que definimos qual **template** e **controlador** serão injetados. Outras configurações como **resolve**, **redirectTo **e **reloadOnSearch** também são válidas. Os detalhes sobre essas configurações podem ser vistos <a href="https://docs.angularjs.org/api/ngRoute/provider/$routeProvider" target="_blank">aqui</a>.

O método **otherwise** é utilizado para definir uma rota padrão. Assim, quando nenhuma rota for encontrada o AngularJS redirecionará a aplicação para essa rota padrão.

## Eventos

O serviço _$route_ dispara eventos em diferentes estágios do fluxo de uma rota. Esses eventos são importantes quando queremos manipular as rotas e são particularmente importantes quando desejamos detectar se um usuário está logado ou não na aplicação.

#### $routeChangeStart

É disparado antes da mudança da rota. É nesta etapa que todas as dependências necessárias são resolvidas para que a rota mude com sucesso. Uma vez que todas as dependências tenham sido resolvidas o evento _$routeChangeSucess_ é disparado.

Parâmetros:

  * **angularEvent**: objeto de evento;
  * **next: i**nformação sobre a futura rota;
  * **current**: informação sobre a rota atual;

{% highlight javascript linenos %}
{% raw %} 
(function() {
  'use strict';
  angular.module('feira-app', ['ngRoute']);

  angular.module('feira-app')
    .run(function($rootScope, $route, $routeParams, $location) {
      
      $rootScope.$on('$routeChangeStart',function(evt,next,current){
        console.log('Nome do Evento:'+evt.name);
        console.log('Próxima Rota:'+ angular.toJson(next));
        console.log('Rota Atual:'+ angular.toJson(current));
      });

      $rootScope.$route = $route;
      $rootScope.$location = $location;
      $rootScope.$routeParams = $routeParams;
    });
})();
{% endraw %} 
{% endhighlight %}
Aquela explicação que fiquei devendo lá em cima vem agora.

Na função **_run_** (linhas 6) estamos setando os services _$route_, _[$routeparams](https://docs.angularjs.org/api/ngRoute/service/$routeParams)_ e _[$location](https://docs.angularjs.org/api/ng/service/$location)_ no _$rootScope_. Isso está sendo feito para que possamos utilizar esses serviços na _view_ (linhas 14 a 18 do index.html). Através desses serviços, podemos identificar os parâmetros da URL, qual template e controlador estão sendo injetados na rota atual, entre outras informações.

#### $routeChangeSuccess

É disparado após a mudança bem sucedida da rota.

Parâmetros:

  * **angularEvent**: o objeto de evento;
  * **current:** informação sobre a rota atual;
  * **previous**: informações da rota anterior, ou _undefined_ se for a primeira rota a ser invocada.

#### $routeChangeError

Se alguma mudança de rota for rejeitada, esse evento será disparado.

Parâmetros:

  * **angularEvent**: o objeto de evento;
  * **current:** informação sobre a rota atual;
  * **previous**: informações da rota anterior;
  * **rejection:** a _promise _que foi rejeitada.

#### $routeUpdate

Este evento é disparado se a propriedade **_reloadOnSearch_** estiver setada com **_false_** e se estivermos reutilizando a mesma instância do controlador.

Parâmetros:

  * **angularEvent**: o objeto de evento;
  * **current:** informação sobre a rota atual/anterior;

Ainda há configurações que não terei espaço para abordar aqui, como o <a href="https://docs.angularjs.org/api/ng/provider/$locationProvider#html5Mode" target="_blank">hashbang mode</a> (html5Mode), o <a href="https://docs.angularjs.org/api/ng/provider/$locationProvider#hashPrefix" target="_blank">hashPrefix</a> e os detalhes do serviço _$location_. 

Existe um outro módulo de rotas chamado <a href="https://github.com/angular-ui/ui-router" target="_blank">AngularUI Router</a>, que utiliza uma abordagem diferente. Particularmente o considero melhor que o ngRoute. Ele é baseado em estados (_states_) e não em URL. Falaremos mais sobre ele em um futuro post. 😉

Então é isso pessoal, espero que tenham curtido.

Os arquivos do nosso exemplo podem ser visualizados na íntegra no <a href="https://gist.github.com/gabrielfeitosa/829c603b11f1988d1657" target="_blank">gist</a> ou no <a href="https://github.com/gabrielfeitosa/blog_exemplos/tree/master/angularjs/rotas/ngRoute" target="_blank">repositório de código</a> do blog. **<a href="https://gabrielfeitosa.com/exemplos/angularjs/rotas/ngRoute/#/animais" target="_blank">Aqui</a>** você pode ver a aplicação rodando.

Tem dúvidas, críticas ou sugestões? Deixe um comentário aí que terei o maior prazer em responder.

Abraços e até a próxima!