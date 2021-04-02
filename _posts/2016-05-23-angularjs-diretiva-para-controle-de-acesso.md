---
title: 'AngularJS: Diretiva para controle de acesso'
date: 2016-05-23T10:19:59+00:00
layout: post
guid: https://gabrielfeitosa.com/?p=526
permalink: /angularjs-diretiva-para-controle-de-acesso/
comments: true
categories:
  - AngularJs
tags:
  - angular
  - angularjs
  - directive
  - diretiva
  - frontend
  - html
---
Fala galera!

Semana passada, recebi um e-mail perguntando se eu tinha algum exemplo, com **AngularJS,** para controlar as permissões de acesso do usuário aos botões da aplicação. Pensei: porquê não juntar a fome com a vontade de comer e blogar a respeito? Então vamos nessa!
<!--more-->

## Diretiva

Antes de colocar a mão na massa, é importante saber que o melhor lugar para se manipular o _DOM_ é dentro de uma _**<a href="https://docs.angularjs.org/guide/directive" target="_blank">directive</a>**._ Isso se deve ao comportamento do _<a href="https://docs.angularjs.org/guide/compiler" target="_blank">Angular HTML Compiler</a>_. Pode parecer meio estranho falar sobre **compilar,** mas é graças ao _HTML_ **_Compiler_** que podemos anexar comportamento a qualquer elemento _HTML_ ou adicionar atributos.

Uma **dica importante** refere-se a normalização dos nomes das diretivas. O AngularJS geralmente utiliza _**camelCase**_ para normalizá-las (exemplo: _ngRepeat_ e _ngModel_). Porém, temos que lembrar que o _HTML_ não é **_case sensitive_**. Por esse motivo, usamos letras minúsculas e mais um traço separando as palavras (_ng-repeat_ e _ng-model_) para utilizar as diretivas no _DOM ._ 

O nome da nossa diretiva de acesso será &#8220;**permissaoAcesso**&#8220;**.** Ela terá a restrição de ser utilizada unicamente como atributo em um elemento do _DOM_. E é aqui que pode surgir a dúvida: &#8220;mas Gabriel, tem como restringir como a diretiva vai ser utilizada?&#8221;

A resposta é sim. As diretivas possuem a opção de restringir como serão usadas. Essa opção é a **_restrict_**  e ela obedece os seguintes parâmetros:

* **A**: só pode ser utilizada como atributo.
* **E**: só pode ser utilizada como elemento.
* **C**: só pode ser utilizada como classe (_class_) css.
* **M**: só pode ser utilizada como comentário.

Mas e se eu quiser usar como elemento e atributo, como faço? Aí é só mesclar com as letras que você desejar, por exemplo &#8216;AECM&#8217;, que libera o uso da diretiva em todas as opções mencionadas acima.
  
Por <em>default</em>, a opção <em>restrict </em>será &#8216;AE&#8217;. Ou seja, poderá ser utilizada como elemento e atributo.

## Construindo a diretiva permissaoAcesso
 
Para iniciar, vamos criar uma página <em>HTML</em> que exibirá os elementos (botão e <em>link</em>). A regra é que se o usuário não possuir a permissão de acesso o elemento deverá ser desabilitado, caso contrário ele será exibido normalmente.

{% highlight html linenos%}
<!DOCTYPE html>
<html ng-app="acesso">
<head>
  <meta charset="utf-8" />
  <link rel="shortcut icon" type="image/x-icon" href="favicon.ico">
  <title>Blog do Gabriel Feitosa</title>
  <link rel="stylesheet" href="font-awesome/css/font-awesome.min.css">
  <style>
    .block {
        margin-left: 5px;
        color: red;
    }
    
    a[disabled] {
        pointer-events: none;
    }
    
    td {
        padding: 5px
    }
  </style>
</head>

<body>
  <h1>AngularJS: Diretiva de acesso</h1>
  <table>
    <th>
      <tr>
          <td></td>
          <td>Botão</td>
          <td>Link</td>
      </tr>
    </th>
    <tr>
      <td>Com Restrição</td>
      <td>
          <button permissao-acesso="block" onclick="alert('Ops, deu errado!')">Botão</button>
      </td>
      <td>
          <a href="" permissao-acesso="block" onclick="alert('Ops, deu errado!')">Link</a>
      </td>
    </tr>
    <tr>
      <td>Sem Restrição</td>
      <td>
        <button permissao-acesso="no-block" onclick="alert('Aeee \\o/, botão liberado!')">Botão</button>
      </td>
      <td>
        <a href="" permissao-acesso="no-block" onclick="alert('Aeee \\o/, link liberado!')">Link</a>
      </td>
    </tr>
  </table>

  <footer>
      <hr/>
      <a href="https://gabrielfeitosa.com"> Blog do Gabriel Feitosa</a>
  </footer>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular.min.js"></script>
  <script src="js/app.js"></script>
</body>

</html>
{% endhighlight %}

Como pode ser visto no código acima, os elementos<em> &#8220;button&#8221; e </em>&#8220;a&#8221; possuem a nossa diretiva &#8220;permissao-acesso&#8221;. A diretiva está recebendo um valor (<em>block</em> e <em>no-block</em>) que será utilizado na nossa lógica para bloquear ou não o elemento.
  
O evento de <em>click</em> dos elementos está configurado com um <strong><em>alert</em></strong>. Assim,<strong> </strong><strong> </strong>uma mensagem será exibida caso consigamos clicar no elemento<strong>.</strong>

Para incrementar a diretiva, utilizei a <em>lib <a href="http://fontawesome.io/" target="_blank">Font Awesome, </a></em>para adicionar um ícone quando o elemento estiver bloqueado (só frescura mesmo! ;))

Agora vamos ver a implementação da nossa diretiva permissaoAcesso<strong>:</strong>
  
{% highlight javascript linenos%}
(function(){
  angular.module('acesso',[])
  .directive('permissaoAcesso', function(){
    return {
      restrict: 'A',
      link: function ($scope, element, attrs) {
        if (attrs.permissaoAcesso === 'block') {
            element.attr('disabled', 'disabled');
            element.append('<span class="block fa fa-lock"></span>');
        }
      }
    };
  });
})();
{% endhighlight %}

Perceba que o primeiro parâmetro da diretiva é o <em>restrict</em> com valor &#8220;A&#8221;. Como dito anteriormente, essa diretiva só poderá ser utilizada como um atributo.
  
Em seguida, temos uma novidade que é a opção <em><strong>link</strong></em>. É aqui que normalmente manipulamos o <em>DOM </em>e colocamos a nossa lógica de negócio. A função do <em>link </em>é executada após o template ser clonado e recebe cinco parâmetros:
 
<ol>
  <li>
    <strong>scope</strong>: o objeto $scope do AngularJS.
  </li>
  <li>
    <strong>element: </strong>é o elemento que está sendo processado. Esse elemento está dentro de um <em>wrapper </em>do <a href="https://docs.angularjs.org/api/ng/function/angular.element" target="_blank">jqLite</a>.
  </li>
  <li>
    <strong>attrs</strong>: é um <em>hash</em> dos atributos e seus respectivos valores que estão presentes no elemento.
  </li>
  <li>
    <strong>controller: </strong>é uma instância do controlador.
  </li>
  <li>
    <strong>transcludeFn: </strong>é um <em>link</em> para a função de <em>transclude</em>.
  </li>
</ol>
  
A lógica de negócio da nossa diretiva só utiliza os parâmetros <strong><em>attrs</em></strong> e <strong><em>element</em></strong>.
  
O <strong>attrs </strong>é utilizado para ter acesso ao valor do atributo permissaoAcesso e verificar se o conteúdo dele é <em>block</em>. Caso a condição seja verdadeira, iremos manipular o elemento através do parâmetro <em>element</em>. A ideia é bem simples: adicionamos ao elemento um atributo <em>disabled</em> para bloqueá-lo. Na sequência, incorporamos um elemento <em><strong>span</strong></em> com o ícone do <strong><em>Font Awesome</em></strong>, o que será feito através do <strong><em>element.append</em><em>.</em></strong>
  
A Figura 1 exibe o resultado do uso da diretiva. O exemplo do código está rodando <a href="https://gabrielfeitosa.com/exemplos/angularjs/diretiva_permissao_acesso/index.html" target="_blank">aqui</a> e os fontes estão no <em><a href="https://github.com/gabrielfeitosa/angularjs-directive-access" target="_blank">github</a></em>.

![Resultado do uso da diretiva](/img/resultado_diretiva_acesso.png)

Há muito mais coisas para comentar sobre diretivas, como o <a href="https://docs.angularjs.org/guide/directive#isolating-the-scope-of-a-directive" target="_blank">isolamento do escopo</a>, <a href="https://docs.angularjs.org/api/ng/service/$compile" target="_blank"><em>$compile</em></a>, <em><a href="https://docs.angularjs.org/guide/directive#creating-a-directive-that-wraps-other-elements" target="_blank">transclude</a></em>. Vale a pena dar uma olhada na documentação oficial, que por sinal é muito rica.
 
Usando a imaginação dá para incrementar a diretiva para outros elementos <em>HTML</em> e adicionar ou remover um comportamento de acordo com o tipo do elemento. Lembre que você tem em mãos um <strong><em>wrapper</em> </strong>do elemento em<strong><em> jqLite</em></strong>, que é um subconjunto do <em><strong>jQuery</strong>.</em>
  
Bom, por hora é isso pessoal. Espero que tenham curtido a postagem de hoje.

Abraços e até a próxima!