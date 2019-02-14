---
title: 'AngularJS: Filtros'
date: 2015-09-21T10:03:11+00:00
layout: post
permalink: /angularjs-filtros/
categories:
  - AngularJs
tags:
  - angular
  - angular-filter
  - angularjs
  - filter
  - filtro
  - frontend
---
Fala galera, beleza?

Já precisou formatar algum dado para exibir para o usuário? Pensou em fazer o tratamento lá no backend ou criar uma função javascript para fazer o _parse_ e exibir? Então, neste post vamos ver como o AngularJS trata essa questão com os _<a href="https://docs.angularjs.org/guide/filter" target="_blank">filters</a>._
<!--more-->

## Filtro

Os filtros são utilizados para fazer a formatação dos dados e exibi-los ao usuário. Uma definição bem simples, igual <a href="http://www.onordeste.com/onordeste/enciclopediaNordeste/index.php?titulo=Caretas,+Semana+Santa&ltr=C&id_perso=5219" target="_blank">correr com medo dos caretas</a> na Semana Santa lá no meu <a href="https://pt.wikipedia.org/wiki/Brejo_Santo" target="_blank">Brejim</a> (quem é do interior cearense sabe do que eu estou falando!).

O AngularJS já possui alguns filtros padrão, como, por exemplo, _<a href="https://docs.angularjs.org/api/ng/filter/currency" target="_blank">currency</a>_ para formatação de moeda e _<a href="https://docs.angularjs.org/api/ng/filter/date" target="_blank">date</a>_ para formatação de datas. Na <a href="https://docs.angularjs.org/api/ng/filter" target="_blank">API de Referência</a> podemos verificar todos os filtros disponibilizados pelo framework.

Os filtros podem ser usados na _view_, no _controller,_ na _directive_ ou no _service._ Nós podemos também criar de maneira muito fácil o nosso próprio filtro.

Veja os exemplos abaixo:

## Usando filtros na <em>view</em>

Para utilizarmos o _filter_ na _view_ usamos o **&#124; (pipe)** dentro da expressão {% raw %}**{{}}**{% endraw %}, por exemplo: meu salário {% raw %}**{{ 123456789 &#124; currency }}**{% endraw %}, que vai dar $123,456,789.00 como resposta.

Os filtros podem ser utilizados encadeados, ou seja, o resultado de um pode servir de entrada para o outro, exemplo: **{% raw %}{{ &#8220;1984-12-15T00:00&#8221; &#124; date &#124; uppercase }}{% endraw %}**,** **que teria como saída **DEC 15, 1984**.

Eles ainda podem receber parâmetros, como **{% raw %}{{ &#8220;1984-12-15T00:00&#8221; &#124; date: &#8216;medium&#8217; }} {% endraw %}**e sua respectiva saída **Dec 15, 1984 12:00:00 AM**.

Os exemplos acima  podem ser vistos no gist abaixo e/ou rodando <a href="http://gabrielfeitosa.com/exemplos/angularjs/filter/filter-view.html" target="_blank">aqui</a>.

{% highlight html linenos%}
{% raw %}
<!DOCTYPE html>
<html ng-app="app-filters">

<head>
    <meta charset="UTF-8">
    <title>Blog do Gabriel Feitosa > AngularJS: Filtros</title>
</head>

<body>
    <h1>Filtros - Na View</h1>
    <pre>Filtro currency {{123456789 | currency}} = {{ 123456789 | currency}}</pre>
    <pre>Filtro encadeados {{"1984-12-15T00:00" | date | uppercase}} = {{ "1984-12-15T00:00" | date | uppercase}}</pre>
    <pre>Filtro date com parâmetro {{"1984-12-15T00:00" | date}} = {{ "1984-12-15T00:00" | date:'medium'}}</pre>
    <footer>
        <hr/>
        <a href="http://www.gabrielfeitosa.com"> Blog do Gabriel Feitosa</a>
    </footer>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular.min.js"></script>
    <script src="app.js"></script>
</body>
</html>
{% endraw %}
{% endhighlight %}

><strong>Nota</strong>: Para que o AngularJS funcione com a formatação local para <em>currency, number </em>e <em>date </em>precisaríamos adicionar a <a href="https://docs.angularjs.org/guide/i18n" target="_blank">internacionalização</a>.

## Usando filtros no _controller, service e/ou directive_

Filtros também podem ser utilizados em controladores, serviços e diretivas. Para isso, precisamos do controle de **injeção de dependência**.

Há duas maneiras de um filtro ser injetado, aqui você pode ver o <a href="https://gist.github.com/gabrielfeitosa/8e355c104cd781c9e39f#file-filter-controller-html" target="_blank">gist do html</a> e <a href="http://gabrielfeitosa.com/exemplos/angularjs/filter/filter-controller.html" target="_blank">aqui</a> você o vê rodando:

{% highlight javascript linenos%}
{% raw %}
(function() {
  'use strict';

  angular.module('app-filters')
    .controller('ExemploController', function($scope, $filter,currencyFilter) {
      $scope.moedaFormatada = $filter('currency')(123456789);
      $scope.moedaFormatada2 = currencyFilter(123456789);
      $scope.dataFormatada = $filter('date')('1984-12-15T00:00','medium');
    });

})();
{% endraw %}
{% endhighlight %}

1. Adicionar o sufixo **Filter** ao** **nome do filtro **<nomeDoFiltro>Filter**. Por exemplo, **currencyFilter;**
2. Injetar o service **$filter **e passar, como parâmetro, qual filtro desejamos utilizar. 
Exemplo: **$filter(&#8216;date&#8217;)(&#8216;1984-12-15T00:00&#8242;,&#8217;medium&#8217;);**

<strong>Dica de Performance</strong>: Utilizar filtros fora da <em>view</em> é uma excelente prática quando temos uma grande quantidade de dados a serem filtrados. Isso fará com que eles não precisem ser reformatados sempre que houver uma atualização na tela. Fora da <em>view, </em>o filtro só é utilizado quando necessário, como quando acontece uma atualização de dados do <em>backend</em> ou quando a expressão do filtro é alterada.
{: .notice}

<strong>Porquê o sufixo Filter?  </strong>O sufixo <em>Filter</em> diz ao sistema de injeção de dependência que, caso o filtro esteja presente no <em>provider, </em>deve utilizá-lo. Caso contrário, o DI retira o sufixo <em>Filter</em> e tenta injetar um filtro com nome correspondente. Assim, se o nome do seu filtro é inverterString<span style="text-decoration: underline;">Filter</span> (<strong>você nunca deve nomear seus filtros com o sufixo Filter</strong>), o DI vai procurar primeiro por <em>inverterStringFilterProvider</em> e, se encontrá-lo, irá usá-lo. Do contrário, ele tenta injetar o filtro de nome inverterString.
{: .notice}

## Criando filtros customizados

Criar nosso próprio filtro é muito fácil, só precisamos registrá-lo utilizando a _function_ _**filter**_ no módulo do AngularJS. A syntax pode ser vista no gist abaixo. O primeiro argumento é o nome do filtro e o segundo é a _factory function_ para o filtro.

Vamos criar dois filtros de exemplos:

{% highlight javascript linenos%}
{% raw %}
(function() {
  'use strict';
  angular.module('app-filters', []);

  angular.module('app-filters').filter('cpf', function() {
    return function(input) {
      var str = input + '';
      if(str.length <= 11){
        str = str.replace(/\D/g, '');
        str = str.replace(/(\d{3})(\d)/, "$1.$2");
        str = str.replace(/(\d{3})(\d)/, "$1.$2");
        str = str.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      }
      return str;
    };
  });

  angular.module('app-filters')
    .filter('abestado', function() {
      return function(input,muito) {
        
        var str = input || ''
        if (input) {
          str += ' é abestado';
          if(muito){
            str += ' de cum força'
          }
        }
        return str;
      };
    });
})();
{% endraw %}
{% endhighlight %}

O filtro de formatação de CPF recebe um único parâmetro de entrada e dá como saída um CPF formatado no formato **xxx****.xxx.xxx-xx.** A syntax para utilização é {% raw %}**{{inputCPF &#124; cpf}}**{% endraw %}, como pode ser visto na **linha 13** do gist abaixo.

O segundo filtro que criamos é o **abestado**. Muito útil para elogiar um grande amigo, ele recebe dois parâmetros de entrada. O primeiro é o **nome do amigo** e o segundo é se ele é **muito abestado ou não**. A syntax para utilização é **{% raw %}{{nomeDoAmigo &#124; abestado: param1}}{% endraw %}**, como pode ser visto na **linha 16** do gist abaixo. <a href="http://gabrielfeitosa.com/exemplos/angularjs/filter/filter-custom.html" target="_blank">Aqui</a> você pode ver o exemplo rodando<span style="color: #000000;">.</span>

{% highlight html linenos%}
{% raw %}
<!DOCTYPE html>
<html ng-app="app-filters">

<head>
    <meta charset="UTF-8">
    <title>Blog do Gabriel Feitosa > AngularJS: Filtros</title>
</head>

<body>
    <h1>Filtros - Customizado</h1>
    <input placeholder="Informe um CPF" ng-model="inputCPF"/>
    {{inputCPF | cpf}}
    <br><br>
    <input placeholder="Nome do amigão do peito?" ng-model="amigo"/> 
    {{ amigo | abestado:muito}}
    <br>
    <input type="checkbox" ng-model="muito"/> Seu amigo é muito abestado?
    <footer>
        <hr/>
        <a href="http://www.gabrielfeitosa.com"> Blog do Gabriel Feitosa</a>
    </footer>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular.min.js"></script>
    <script src="app.js"></script>
</body>
</html>
{% endraw %}
{% endhighlight %}

Filtros nos dão um excelente poder quando o assunto é formatação de dados. Ainda há muitas outras opções que não abordei aqui, como o <a href="https://docs.angularjs.org/api/ng/filter/limitTo" target="_blank">limitTo</a> e <a href="https://docs.angularjs.org/api/ng/filter/orderBy" target="_blank">orderBy</a>, que podemos utilizar para limitar e ordenar dados de um coleção de objetos.

Então é isso pessoal, espero que tenham curtido o post.

Abraços e até a próxima!